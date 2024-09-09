export enum FirebaseKeys {
    books = "books",
    authors = "authors",
    bios = "bios",
    descriptions = "descriptions"
}

export type FirebaseDB = {
    [FirebaseKeys.books]: {
        [bookId: string]: {
            name: string,
            authorId: string,
            authorName: string,
            inStock: number,
            price: number,
            img?: string,
        }
    },
    [FirebaseKeys.descriptions]: {
        [bookId: string]: string
    },
    [FirebaseKeys.authors]: {
        [authorId: string]: {
            name: string,
            bookN: number,
            img?: string,
        }
    },
    [FirebaseKeys.bios]: {
        [authorId: string]: string
    },
};