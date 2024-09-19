import { FieldPath, QueryDocumentSnapshot, WhereFilterOp } from "firebase/firestore/lite";
import { PreviewConstraint } from "./firestoreDbTypes";

export type FirestoreQueryParams<P> = {
    filters: Array<{field: keyof PreviewConstraint<P> | FieldPath, op: WhereFilterOp, value: string | number | null}>,
    sorts: Array<{field: keyof PreviewConstraint<P>, desc?: 'desc'}>,
    clip?: boolean,
    lastSnap?: QueryDocumentSnapshot<PreviewConstraint<P>>,
};