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
    initialising,
    pending,
    error,
    notFound
};

export const FETCH_BATCH_SIZE = 2;