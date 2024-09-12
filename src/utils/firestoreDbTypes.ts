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

export type FirestoreBook = {
    [FirestoreKeys.name]: string,
    [FirestoreKeys.name_lowercase]: string,
    [FirestoreKeys.price]: number,
    [FirestoreKeys.inStock]: number
    [FirestoreKeys.authorId]: string,
    [FirestoreKeys.authorName]: string
    [FirestoreKeys.img]?: string,
}

export type FirestoreAuthor = {
    [FirestoreKeys.name]: string,
    [FirestoreKeys.name_lowercase]: string,
    [FirestoreKeys.bookN]: number,
    [FirestoreKeys.img]?: string
};

export type PreviewConstraint = {name: string, img?: string};
export type DetailsConstraint = {description: string};

