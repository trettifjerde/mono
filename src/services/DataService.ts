import { collection, CollectionReference, deleteField, doc, FirestoreDataConverter, getDoc, getDocs, limit, query, QueryConstraint, runTransaction, startAfter, Transaction, UpdateData, writeBatch } from "firebase/firestore/lite";
import { FirestoreKeys } from "../utils/firestoreDbTypes";
import { FirestoreQueryParams } from "../utils/dataTypes";
import Entity from "../utils/classes/Entity";
import DataStore from "../stores/DataStore/DataStore";
import db from "./Firestore";

export default abstract class DataService<E extends Entity> {

    store: DataStore<E>;
    previewsRef: CollectionReference<E['previewInfo']>;
    descriptionsRef: CollectionReference<string>;

    constructor(store: DataStore<E>, previewsKey: FirestoreKeys, descriptionsKey: FirestoreKeys) {

        this.store = store;
        this.previewsRef = collection(db, previewsKey).withConverter(this.previewsConverter);
        this.descriptionsRef = collection(db, descriptionsKey).withConverter(DataService.descriptionConverter);
    }

    async fetchPreviews(params: FirestoreQueryParams<E>) {
        const {filters, sorts, lastSnap, batchSize} = params;

        const constraints : QueryConstraint[] = [...filters, ...sorts];

        switch (batchSize) {
            case 'all':
                break;

            case undefined:
                constraints.push(limit(this.store.batchSize));
                break;

            default:
                constraints.push(limit(batchSize));
        }

        if (lastSnap) 
            constraints.push(startAfter(lastSnap));

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
    abstract postItem(formData: any) : Promise<any>;
    abstract updateItem(initial: E, formData: any) : Promise<ChangeLog<E> & Record<string, any>>;
    abstract deleteItem(item: E) : Promise<void>;
    
    protected writePostBatch({previewInfo, description}: {
        previewInfo: E['previewInfo'], 
        description?: string
    }) {

        const batch = writeBatch(db);
        const previewDoc = doc(this.previewsRef, new Date().getTime().toString())
        batch.set(previewDoc, previewInfo);

        if (description)
            batch.set(doc(this.descriptionsRef), description);

        return {batch, id: previewDoc.id};
    }

    protected async runItemUpdate({initial, previewInfo, description, extraActions}: {
        initial: E, 
        previewInfo: E['previewInfo'], 
        description?: string,
        extraActions?: (t: Transaction) => Promise<void>
    }) {
        return runTransaction(db, async(transaction) => {

            if (extraActions)
                await extraActions(transaction);

            const changeLog : ChangeLog<E> = {};

            const previewUpdateNeeded = this.makePreviewUpdateData(initial, previewInfo);

            if (previewUpdateNeeded) {
                const previewDoc = doc(this.previewsRef, initial.id);
                transaction.update(previewDoc, previewUpdateNeeded);
                changeLog.previewInfo = previewInfo;
            }
    
            if (description !== initial.description) {
                const descRef = doc(this.descriptionsRef, initial.id);
                
                if (description)
                    transaction.set(descRef, description);
                else 
                    transaction.delete(descRef);

                changeLog.description = description;
            }

            return changeLog;
        })
    }

    protected runItemDelete({item, extraActions}: {
        item: E,
        extraActions?: (t: Transaction) => Promise<void>}
    ) {
        return runTransaction(db, async(transaction: Transaction) => {
            if (extraActions)
                await extraActions(transaction);

            transaction.delete(doc(this.previewsRef, item.id));

            if (item.description) 
                transaction.delete(doc(this.descriptionsRef, item.id));
            
            return;
        })
    } 

    protected async fetchDescription(id: string) {
        const snapshot = await getDoc(doc(this.descriptionsRef, id));
        return snapshot.data();
    }

    private async fetchPreview(id: string) {
        const snapshot = await getDoc(doc(this.previewsRef, id));
        return snapshot.data();
    }

    private makePreviewUpdateData(initial: E, previewInfo: E['previewInfo']) {
        const previewUpdate = Object.entries(previewInfo).reduce((acc, [k, newValue]) => {
            const key = k as keyof E['previewInfo'];

            if (newValue !== initial.previewInfo[key]) 
                acc[key] = newValue === undefined ? deleteField() : newValue as any;
            return acc;

        }, {} as UpdateData<E['previewInfo']>);

        return Object.keys(previewUpdate).length ? previewUpdate : null;
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

export type ChangeLog<E extends Entity> =  {
    previewInfo?: E['previewInfo']
    description?: string
};