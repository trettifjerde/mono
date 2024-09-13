import { collection, CollectionReference } from "firebase/firestore/lite";
import { DetailsConstraint, FirestoreAuthor, FirestoreKeys } from "../utils/firestoreDbTypes";
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
        return this.getPreviewSnapshots({
            collectionRef: this.booksRef,
            params: {
                filters: [[FirestoreKeys.authorId, '==', authorId]],
                sorts: []
            }
        })
        .then(snaps => snaps.map(snap => ({
            id: snap.id,
            ...snap.data()
        })))
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
}