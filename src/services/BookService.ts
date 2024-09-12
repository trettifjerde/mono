import DataService from "./DataService";
import { DetailsConstraint, FirestoreBook, FirestoreKeys } from "../utils/firestoreDbTypes";
import { CollectionReference, DocumentData } from "firebase/firestore/lite";

export default class BookService extends DataService<FirestoreBook, DetailsConstraint> {

    override previewsRef: CollectionReference<FirestoreBook, DocumentData>;

    constructor() {
        super(FirestoreKeys.descriptions);    
        this.previewsRef = this.booksRef;
    }

    override async getDetails(id: string) {
        return this.getDescription(id)
            .then(description => ({description}))
    }
}