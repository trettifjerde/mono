import { collection, CollectionReference } from "firebase/firestore/lite";
import { DetailsConstraint, FirestoreBook, FirestoreKeys } from "../utils/firestoreDbTypes";
import BookStore from "../stores/data/BookStore";
import DataService from "./DataService";
import db from "./Firestore";

export type BookPreviewInfo = FirestoreBook;
export type BookDetailsInfo = DetailsConstraint;

export default class BookService extends DataService<BookPreviewInfo, DetailsConstraint> {

    override previewsRef: CollectionReference<BookPreviewInfo>;

    constructor(store: BookStore) {
        super(store, FirestoreKeys.descriptions);    
        
        this.previewsRef = collection(db, FirestoreKeys.books)
            .withConverter(DataService.makePreviewsConverter<FirestoreBook>())
    }

    override async getDetails(id: string) {
        return this.getDescription(id)
            .then(description => ({description}))
    }
}