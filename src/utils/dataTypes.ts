import { QueryDocumentSnapshot, WhereFilterOp } from "firebase/firestore/lite";
import { PreviewConstraint } from "./firestoreDbTypes";
import Entity from "./classes/Entity";

export type FirestoreQueryParams<P> = {
    filters: Array<{field: keyof PreviewConstraint<P>, op: WhereFilterOp, value: string | number}>,
    sorts: Array<{field: keyof PreviewConstraint<P>, desc?: 'desc'}>,
    unlimited?: boolean,
    lastSnap?: QueryDocumentSnapshot<PreviewConstraint<P>>,
};

export type SortConfig<Keys extends string, P> = Record<Keys,{
    field: keyof Entity<P, any>['previewInfo'],
    text: string,
    desc?: 'desc'
}>

export type FilterConfig<Keys extends string, P> = Record<Keys, {
    field: keyof Entity<P, any>['previewInfo'],
    initialValue: any,
    desc?: 'desc',
    constraints: Array<
    {
        op: WhereFilterOp, 
        makeValue(v: any) : string | number
    }>
}>;