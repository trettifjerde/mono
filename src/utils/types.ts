export enum IndexPageTab { books, authors };

export type IndexLoaderData = {
    tab: IndexPageTab.authors,
    items: Promise<AuthorPreviewType[]>
} | {
    tab: IndexPageTab.books
    items: Promise<BookPreviewType[]>
};

export type IndexGridItem = {
    imgSrc: string,
    name: string,
    id: string
};

export type BookPreviewType = IndexGridItem & {
    numberInStock: number,
    price: number
}

export type AuthorPreviewType = IndexGridItem & {
    numberOfBooks: number
}