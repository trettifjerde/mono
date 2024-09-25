export enum Pathnames {
    index = "",
    authors = "authors",
    books = "books",
    new = "new",
    id = "id"
};

export enum LoadingState {
    idle,
    initialising,
    pending,
    error,
    notFound
};

export const FETCH_BATCH_SIZE = 4;

export const BASE = "/mono/";