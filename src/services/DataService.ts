import { collection, CollectionReference, doc, FirestoreDataConverter, getDoc, getDocs, limit, query, QueryConstraint, startAfter } from "firebase/firestore/lite";
import { FirestoreKeys } from "../utils/firestoreDbTypes";
import { FirestoreQueryParams } from "../utils/dataTypes";
import { FETCH_BATCH_SIZE } from "../utils/consts";
import DataStore from "../stores/DataStore/DataStore";
import db from "./Firestore";
import Entity from "../utils/classes/Entity";

export default abstract class DataService<E extends Entity> {

    batchSize = FETCH_BATCH_SIZE;

    store: DataStore<E>;
    previewsRef: CollectionReference<E['previewInfo']>;
    descriptionsRef: CollectionReference<string>;

    constructor(store: DataStore<E>, previewsKey: FirestoreKeys, descriptionsKey: FirestoreKeys) {

        this.store = store;
        this.previewsRef = collection(db, previewsKey)
            .withConverter(this.previewsConverter);
        this.descriptionsRef = collection(db, descriptionsKey)
            .withConverter(DataService.descriptionConverter);
    }

    async fetchPreviews(params: FirestoreQueryParams<E>) {
        const {filters, sorts, lastSnap, unlimited} = params;

        const constraints : QueryConstraint[] = [...filters, ...sorts];

        if (lastSnap) 
            constraints.push(startAfter(lastSnap));

        if (!unlimited)
            constraints.push(limit(this.batchSize));

        const {docs} = await getDocs(query(this.previewsRef, ...constraints));

        return {
            previews: docs.map(snap => ({
                id: snap.id,
                previewInfo: snap.data()
            })),
            lastSnap: docs.length ? docs[docs.length - 1] : null
        };
    }

    async fetchFullItemInfo(id: string) {
        return Promise.all([
            this.fetchPreview(id),
            this.fetchDetails(id)
        ])
        .then(([previewInfo, detailsInfo]) => {
            if (!previewInfo)
                return undefined;

            return {
                previewInfo,
                detailsInfo
            }
        })
    }

    abstract fetchDetails(id: string) : Promise<E['detailsInfo']>;

    protected async fetchDescription(id: string) {
        const snapshot = await getDoc(doc(this.descriptionsRef, id));
        return snapshot.data();
    }

    private async fetchPreview(id: string) {
        const snapshot = await getDoc(doc(this.previewsRef, id))
        return snapshot.data();
    }

    private previewsConverter : FirestoreDataConverter<E['previewInfo']> = {
        toFirestore: (preview) => preview,
        fromFirestore: (snapshot) => ({
            ...snapshot.data()
        })
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