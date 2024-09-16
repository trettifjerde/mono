import { collection, CollectionReference, doc, FirestoreDataConverter, getDoc, getDocs, limit, orderBy, query, QueryConstraint, startAfter, where } from "firebase/firestore/lite";
import { FirestoreKeys, PreviewConstraint as PC, DetailsConstraint as DC, FirestoreBook, PreviewsQueryParams } from "../utils/firestoreDbTypes";
import StoreSlice from "../stores/slices/StoreSlice";
import { FETCH_BATCH_SIZE } from "../utils/consts";
import db from "./Firestore";

export default abstract class DataService<P extends PC, D extends DC> {

    batchSize = FETCH_BATCH_SIZE;

    slice: StoreSlice<P,D>;
    abstract previewsRef: CollectionReference<P>;
    descriptionsRef: CollectionReference<string>;
    booksRef: CollectionReference<FirestoreBook>;

    constructor(storeSlice: StoreSlice<P,D>, descriptionsKey: FirestoreKeys) {

        this.slice = storeSlice;

        this.booksRef = collection(db, FirestoreKeys.books)
            .withConverter(DataService.makePreviewsConverter<FirestoreBook>());

        this.descriptionsRef = collection(db, descriptionsKey)
            .withConverter(DataService.descriptionConverter);
    }

    protected async getPreviewSnapshots<AnyPreviewType extends PC>({
        collectionRef, 
        params
    }: FetchPreviewsInit<AnyPreviewType>) {
        
        const constraints : QueryConstraint [] = [];

        if (params) {
            const {filters, sorts, lastSnap} = params;

            filters.forEach((filter) => constraints.push(where(...filter)));

            sorts.forEach(({dbKey, desc}) => constraints.push(orderBy(dbKey, desc)));

            if (lastSnap) 
                constraints.push(startAfter(lastSnap));
        }

        constraints.push(limit(this.batchSize));

        const snapshot = await getDocs(query(collectionRef, ...constraints));

        return snapshot.docs;
    }

    async getPreviews(params: PreviewsQueryParams) {
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

    abstract getDetails(id: string) : Promise<D | null>;

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

    static makePreviewsConverter<AppPreview extends PC>() {
        return {
            toFirestore: (preview) => preview,
            fromFirestore: (snapshot) => ({
                ...snapshot.data()})
        } as FirestoreDataConverter<AppPreview>;
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

type FetchPreviewsInit<T extends PC> = {
    collectionRef: CollectionReference<T>,
    params?: PreviewsQueryParams, 
}