export enum IndexPageTab { books, authors };

export type IndexLoaderData = {
    tab: IndexPageTab.authors,
    items: Promise<AuthorPreviewType[]>
} | {
    tab: IndexPageTab.books
    items: Promise<BookPreviewType[]>
};

export type BookType = {
    id: string,
    authorId: string,
    title: string,
    imgSrc: string,
    price: number,
    numberInStock: number,
    description: string
}

export type AuthorType = {
    name: string,
    lastname: string,
    id: string,
    imgSrc: string,
    bio: string
}

export type IndexGridItem = {
    imgSrc: string,
    name: string,
    id: string
};


export type BookPreviewType = IndexGridItem & {
    numberInStock: number,
    price: number,
    authorId: string
}

export type AuthorPreviewType = IndexGridItem & {
    numberOfBooks: number
}

export type DropdownOption = {
    id: string,
    text: string
}

export type SelectOptionsConfig<T extends DropdownOption> =  {
    defaultOptions: T[],
    dynamic: false,
} | {
    getOptions: (arg: string) => Promise<T[] | null>,
    dynamic: true
};