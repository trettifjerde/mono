import { collection, CollectionReference, doc, FieldPath, FirestoreDataConverter, getDoc, getDocs, limit, orderBy, query, QueryConstraint, startAfter, where } from "firebase/firestore/lite";
import { FirestoreKeys, PreviewConstraint as PC, DetailsConstraint as DC, FirestoreBook } from "../utils/firestoreDbTypes";
import { FETCH_BATCH_SIZE } from "../utils/consts";
import db from "./Firestore";

export default abstract class DataService<P extends PC, D extends DC> {

    batchSize = FETCH_BATCH_SIZE;

    abstract previewsRef: CollectionReference<P>;
    descriptionsRef: CollectionReference<string>;
    booksRef: CollectionReference<FirestoreBook>;

    previewsWithIdConverter: FirestoreDataConverter<WithId<P>>;

    constructor(descriptionsKey: FirestoreKeys) {

        this.booksRef = collection(db, FirestoreKeys.books)
            .withConverter(DataService.makePreviewsConverter<FirestoreBook>());
        this.descriptionsRef = collection(db, descriptionsKey)
            .withConverter(DataService.descriptionConverter);

        this.previewsWithIdConverter = DataService.makePreviewsWithIdConverter<P>();

    }

    protected async getAnyPreviews<AnyPreviewType extends PC>({
        collectionRef, 
        converter,
        params
    }: FetchPreviewsInit<AnyPreviewType>) {
        
        const constraints : QueryConstraint [] = [];

        constraints.push(limit(this.batchSize));

        if (params) {
            const {filters, sort, lastItemValue} = params;

            if (filters) {
                filters.forEach(([filterType, value]) => {

                    switch (filterType) {
                        case FirestoreKeys.name_lowercase:
                            constraints.push(where(filterType, '>=', value));
                            constraints.push(where(filterType, '<=', value + '\uf8ff'));
                            break;
                    }
                });
            }

            if (sort) {
                constraints.push(orderBy(sort.dbKey, sort.isDesc ? 'desc' : undefined));
            }

            if (lastItemValue) 
                constraints.push(startAfter(lastItemValue))
        }
        
        const q = query(
            collectionRef
                .withConverter(converter ? converter : DataService.makePreviewsWithIdConverter<AnyPreviewType>()), 
            ...constraints
        );

        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => doc.data());
    }

    async getPreviews(params: PreviewsQueryParams) {
        return this.getAnyPreviews({
            collectionRef: this.previewsRef,
            params
        });
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

    static makePreviewsWithIdConverter<AppPreview extends PC>() {
        return {
            toFirestore: (preview) => preview.previewInfo,
            fromFirestore: (snapshot) => ({
                id: snapshot.id,
                previewInfo: snapshot.data()
            }),
        } as FirestoreDataConverter<WithId<AppPreview>>;
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

export type WithId<P extends PC> = {
    id: string,
    previewInfo: P
};

export type PreviewsQueryParams = {
    filters?: Array<[FirestoreKeys, string]>,
    sort?: {dbKey: FirestoreKeys | FieldPath, isDesc: boolean},
    lastItemValue?: string|number, 
};

type FetchPreviewsInit<T extends PC> = {
    collectionRef: CollectionReference<T>,
    converter?: FirestoreDataConverter<any>,
    params?: PreviewsQueryParams, 
}