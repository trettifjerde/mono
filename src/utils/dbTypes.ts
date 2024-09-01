export enum FirebaseKeys {
    books = "books",
    authors = "authors",
    bookDescriptions = "descriptions",
    authorBios = "bios"
}

export type FirebaseDB = {
    [FirebaseKeys.books]: {
        [bookId: string]: {
            authorId: string,
            authorName: string,
            title: string,
            numberInStock: number,
            price: number,
            img?: string,
        }
    },
    [FirebaseKeys.bookDescriptions]: {
        [bookId: string]: string,
    }
    [FirebaseKeys.authors]: {
        [authorId: string]: {
            name: string,
            bookN: number,
            img?: string,
        }
    },
    [FirebaseKeys.authorBios]: {
        [authorId: string]: string
    },
};

export type FirebaseBookPreview = FirebaseDB[FirebaseKeys.books][""];
export type FirebaseAuthorPreview = FirebaseDB[FirebaseKeys.authors][""];
export type FirebaseBookDescription = FirebaseDB[FirebaseKeys.bookDescriptions][""];
export type FirebaseAuthorBio = FirebaseDB[FirebaseKeys.authorBios][""];