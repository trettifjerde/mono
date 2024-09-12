import { collection, CollectionReference, FirestoreDataConverter } from "firebase/firestore/lite";
import { DetailsConstraint, FirestoreAuthor, FirestoreBook, FirestoreKeys } from "../utils/firestoreDbTypes";
import DataService from "./DataService";
import db from "./Firestore";
import Book from "../utils/classes/Book";

export type AuthorPreview = FirestoreAuthor;
export type AuthorDetails = DetailsConstraint & {
    books: Book['preview'][]
}

export default class AuthorService extends DataService<AuthorPreview, AuthorDetails> {

    override previewsRef: CollectionReference<FirestoreAuthor>;

    constructor() {
        super(FirestoreKeys.bios);
        
        this.previewsRef = collection(db, FirestoreKeys.authors)
            .withConverter(DataService.makePreviewsConverter<AuthorPreview>())
    }

    async getAuthorBooks(authorId: string) {
        return this.getAnyPreviews({
            collectionRef: this.booksRef,
            converter: this.authorBooksConverter,
            params: {
                filters: [[FirestoreKeys.authorId, authorId]]
            }
        })
    }

    override getDetails(id: string) {
        return Promise.all([
            this.getDescription(id),
            this.getAuthorBooks(id)
        ])
        .then(([description, books]) => ({
            description,
            books
        }))
    }

    authorBooksConverter : FirestoreDataConverter<Book['preview'], FirestoreBook> = {
        toFirestore: (value: Book['preview']) => {
            const {id, ...info} = value;
            return info;
        },
        fromFirestore(snapshot) {
            const id = snapshot.id;
            const data = snapshot.data();
            return {
                id,
                ...data
            } as Book['preview']
        }
    }
}