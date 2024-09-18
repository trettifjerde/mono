import { collection, CollectionReference, doc, FirestoreDataConverter, getDoc, getDocs, limit, orderBy, query, QueryConstraint, startAfter, where } from "firebase/firestore/lite";
import { DetailsConstraint, FirestoreKeys, PreviewConstraint } from "../utils/firestoreDbTypes";
import { FirestoreQueryParams } from "../utils/dataTypes";
import { FETCH_BATCH_SIZE } from "../utils/consts";
import DataStore from "../stores/data/DataStore";
import db from "./Firestore";

export default abstract class DataService<P, D> {

    batchSize = FETCH_BATCH_SIZE;

    store: DataStore<P, D>;
    abstract previewsRef: CollectionReference<PreviewConstraint<P>>;
    descriptionsRef: CollectionReference<string>;

    constructor(store: DataStore<P, D>, descriptionsKey: FirestoreKeys) {

        this.store = store;

        this.descriptionsRef = collection(db, descriptionsKey)
            .withConverter(DataService.descriptionConverter);
    }

    async getPreviews(params: FirestoreQueryParams<P>) {
        return this.getPreviewSnapshots({
            collectionRef: this.previewsRef,
            params
        })
        .then(snaps => ({
            previews: snaps.map(snap => ({
                id: snap.id,
                previewInfo: snap.data()
            })),
            lastSnap: snaps.length ? snaps[snaps.length - 1] : null
        }));
    }

    async getPreview(id: string) {
        const snapshot = await getDoc(doc(this.previewsRef, id))
        
        return snapshot.exists() ? snapshot.data() : null;
    }

    protected async getDescription(id: string) {
        const snapshot = await getDoc(doc(this.descriptionsRef, id));
        return snapshot.data() || '';
    }

    abstract getDetails(id: string) : Promise<DetailsConstraint<D> | null>

    async getFullInfo(id: string) {
        return Promise.all([
            this.getPreview(id),
            this.getDetails(id)
        ])
        .then(([previewInfo, detailsInfo]) => {
            if (!previewInfo || !detailsInfo)
                return null;

            return {
                previewInfo,
                detailsInfo,
            };
        })
    }

    private async getPreviewSnapshots<T>({
        collectionRef, 
        params,
    }: FetchPreviewsInit<T>) {
        
        const constraints : QueryConstraint [] = [];

        if (params) {
            const {filters, sorts, lastSnap, unlimited} = params;

            filters.forEach(({field, op, value}) => constraints.push(where(field as string, op, value)));
                
            sorts.forEach(({field, desc}) => constraints.push(orderBy(field as string, desc)));

            if (lastSnap) 
                constraints.push(startAfter(lastSnap));

            if (!unlimited)
                constraints.push(limit(this.batchSize));
        }

        const snapshot = await getDocs(query(collectionRef, ...constraints));

        return snapshot.docs;
    }

    static makePreviewsConverter<T>() {
        return {
            toFirestore: (preview) => preview,
            fromFirestore: (snapshot) => ({
                ...snapshot.data()})
        } as FirestoreDataConverter<T>;
    };

    static descriptionConverter : FirestoreDataConverter<string> = {
        toFirestore(value: string) {
            return { value };
        },
        fromFirestore(snapshot) {
            return snapshot.data().value as string;
        }
    };
}

type FetchPreviewsInit<T> = {
    collectionRef: CollectionReference<PreviewConstraint<T>>,
    params: FirestoreQueryParams<T>
}