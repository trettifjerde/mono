import { QueryDocumentSnapshot, QueryFieldFilterConstraint, QueryOrderByConstraint } from "firebase/firestore/lite";
import Entity from "./classes/Entity";

export type PreviewShapshot<E extends Entity> = QueryDocumentSnapshot<E['previewInfo']>

export type FirestoreQueryParams<E extends Entity> = {
    filters: QueryFieldFilterConstraint[],
    sorts: QueryOrderByConstraint[],
    unlimited?: boolean,
    lastSnap?: PreviewShapshot<E>,
};

export type FilterConfig<Keys extends string, E extends Entity> = Record<Keys, {
    makeConstraints: (value: any) => {
        filters: QueryFieldFilterConstraint[], 
        sort: QueryOrderByConstraint
    },
    makeFilterFn: (value: any) => (e: E) => boolean, 
    initialValue: any,
}>;

export type SortConfig<Keys extends string, E extends Entity> = Record<Keys,{
    field: keyof E['previewInfo'],
    text: string,
    desc?: 'desc'
}>