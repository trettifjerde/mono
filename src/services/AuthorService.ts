import { collection, CollectionReference } from "firebase/firestore/lite";
import { DetailsConstraint, FirestoreAuthor, FirestoreKeys } from "../utils/firestoreDbTypes";
import DataService from "./DataService";
import AuthorSlice from "../stores/slices/AuthorSlice";
import db from "./Firestore";
import Book from "../utils/classes/Book";

export type AuthorPreviewInfo = FirestoreAuthor;
export type AuthorDetailsInfo = DetailsConstraint & {
    books: Book['preview'][]
}

export default class AuthorService extends DataService<AuthorPreviewInfo, AuthorDetailsInfo> {

    override previewsRef: CollectionReference<FirestoreAuthor>;

    constructor(storeSlice: AuthorSlice) {
        super(storeSlice, FirestoreKeys.bios);
        
        this.previewsRef = collection(db, FirestoreKeys.authors)
            .withConverter(DataService.makePreviewsConverter<AuthorPreviewInfo>())
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