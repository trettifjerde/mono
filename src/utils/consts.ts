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
    notFound,
    notInitialised
};

export const DefaultBookImgSrc = '/800x800.webp';