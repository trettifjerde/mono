import { FirebaseBookDescription, FirebaseBookPreview, FirebaseKeys } from "../utils/dbTypes";
import DataService from "./DataService";

export default class BookService extends DataService {

    constructor() {
        super()
    }

    getBook(id: string) {
        return Promise.all([
            this.fetchDB<FirebaseBookPreview>({
                keys: [FirebaseKeys.books, id]
            }),
            this.fetchDB<FirebaseBookDescription>({
                keys: [FirebaseKeys.bookDescriptions, id]
            })
        ])
        .then(([book, description]) => {
            if (!book)
                throw new Error('Book not found')

            return {
                id,
                ...book,
                description
            }
        })
    }
}

export type Book = Awaited<ReturnType<BookService['getBook']>>