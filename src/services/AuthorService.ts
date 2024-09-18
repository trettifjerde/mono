import { collection, CollectionReference } from "firebase/firestore/lite";
import { DetailsConstraint, FirestoreAuthor, FirestoreKeys } from "../utils/firestoreDbTypes";
import DataService from "./DataService";
import AuthorStore from "../stores/data/AuthorStore";
import Book from "../utils/classes/Book";
import db from "./Firestore";

export type AuthorPreviewInfo = FirestoreAuthor;
export type AuthorDetailsInfo = DetailsConstraint & {books: Book[]}

export default class AuthorService extends DataService<AuthorPreviewInfo, AuthorDetailsInfo> {

    override previewsRef: CollectionReference<AuthorPreviewInfo>;

    constructor(store: AuthorStore) {
        super(store, FirestoreKeys.bios);
        
        this.previewsRef = collection(db, FirestoreKeys.authors)
            .withConverter(DataService.makePreviewsConverter<FirestoreAuthor>())
    }

    override getDetails(id: string, allBooks=false) : Promise<AuthorDetailsInfo | null>{
        return Promise.all([
            this.getDescription(id),
            this.store.rootStore.books.getAuthorBooks(id, allBooks)
        ])
        .then(([description, books]) => {
            if (!books)
                return null;

            return {
                description,
                books
            }
        })
    }
}