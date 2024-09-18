import { collection, CollectionReference } from "firebase/firestore/lite";
import { AuthorPreviewInfo, FirestoreAuthor, FirestoreKeys, PreviewConstraint } from "../utils/firestoreDbTypes";
import { AuthorDetailsInfo } from "../utils/classes/Author";
import DataService from "./DataService";
import AuthorStore from "../stores/data/AuthorStore";
import db from "./Firestore";

export default class AuthorService extends DataService<AuthorPreviewInfo, AuthorDetailsInfo> {

    override previewsRef: CollectionReference<PreviewConstraint<AuthorPreviewInfo>>;

    constructor(store: AuthorStore) {
        super(store, FirestoreKeys.bios);
        
        this.previewsRef = collection(db, FirestoreKeys.authors)
            .withConverter(DataService.makePreviewsConverter<FirestoreAuthor>())
    }

    override getDetails(id: string, allBooks=false) {
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