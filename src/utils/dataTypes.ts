import { WhereFilterOp } from "firebase/firestore/lite";
import { PreviewConstraint} from "./firestoreDbTypes"

export type SortConfig<Keys extends string, P extends PreviewConstraint> = Record<Keys,{
    field: keyof P,
    text: string,
    desc?: 'desc'
}>

export type FilterConfig<Keys extends string, P extends PreviewConstraint> = Record<Keys, {
    field: keyof P,
    initialValue: any,
    desc?: 'desc',
    constraints: Array<
    {
        op: WhereFilterOp, 
        makeValue(v: any) : string | number
    }>
}>;