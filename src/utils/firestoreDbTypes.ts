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

export type FirestoreBook = PreviewConstraint<BookPreviewInfo>
export type FirestoreAuthor = PreviewConstraint<AuthorPreviewInfo>;

export type BookPreviewInfo = {
    [FirestoreKeys.authorId]: string | null,
    [FirestoreKeys.authorName]: string | null,
    [FirestoreKeys.price]: number,
    [FirestoreKeys.inStock]: number
}
export type AuthorPreviewInfo = {
    [FirestoreKeys.bookN]: number,
}

export type PreviewConstraint<P> = P extends Record<string, any> ? PreviewInfo & P : PreviewInfo;
export type DetailsConstraint<D> = D extends Record<string, any> ? DetailsInfo & D : DetailsInfo;

export type PreviewInfo = {
    [FirestoreKeys.name]: string, 
    [FirestoreKeys.name_lowercase]: string,
    [FirestoreKeys.img]?: string,
};
export type DetailsInfo = {description: string | undefined};
