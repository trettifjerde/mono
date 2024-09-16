import { DocumentSnapshot, WhereFilterOp } from "firebase/firestore/lite";

export enum FirestoreKeys {
    authors = "authors",
    books = "books",
    bios = "bios",
    descriptions = "descriptions",
    name = "name",
    name_lowercase = "name_lc",
    img = "img",
    authorId = "authorId",
    authorName = "authorName",
    inStock = "inStock",
    price = "price",
    bookN = "bookN"
};

export type PreviewConstraint = {
    [FirestoreKeys.name]: string, 
    [FirestoreKeys.name_lowercase]: string,
    [FirestoreKeys.img]?: string,
};
export type DetailsConstraint = {
    description: string
};

export type DbSchema = {
    [FirestoreKeys.books]: {
        [bookId: string]: FirestoreBook
    },
    [FirestoreKeys.descriptions]: {
        [bookId: string]: string
    },
    [FirestoreKeys.authors] : {
        [authorId: string]: FirestoreAuthor
    },
    [FirestoreKeys.bios]: {
        [authorId: string]: string
    },
}

export type FirestoreBook = PreviewConstraint & {
    [FirestoreKeys.price]: number,
    [FirestoreKeys.inStock]: number
    [FirestoreKeys.authorId]: string,
    [FirestoreKeys.authorName]: string
}

export type FirestoreAuthor = PreviewConstraint & {
    [FirestoreKeys.bookN]: number,
};

export type PreviewsQueryParams = {
    filters: Array<[FirestoreKeys, WhereFilterOp, string |number]>,
    sorts: Array<{dbKey: FirestoreKeys, desc?: 'desc'}>,
    lastSnap?: DocumentSnapshot, 
};