import { WhereFilterOp } from "firebase/firestore/lite";

export enum Pathnames {
    index = "",
    authors = "authors",
    books = "books",
    new = "new",
    bookId = "bookId",
    authorId = "authorId"
};

export enum LoadingState {
    idle,
    loading,
    error,
    notFound
};

export const FETCH_BATCH_SIZE = 2;

export const NAME_FILTER_CONSTRAINTS_PARTS = [
    {
        op: '>=' as WhereFilterOp,
        makeValue: (v: string) => v
    },
    {
        op: '<=' as WhereFilterOp,
        makeValue: (v: string) => `${v}\uf8ff`
    }
]