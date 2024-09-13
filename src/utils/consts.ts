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

export const DefaultBookImgSrc = '/800x800.webp';

export const FETCH_BATCH_SIZE = 1;