import { collection, CollectionReference } from "firebase/firestore/lite";
import { BookPreviewInfo, FirestoreBook, FirestoreKeys, PreviewConstraint } from "../utils/firestoreDbTypes";
import { BookDetailsInfo } from "../utils/classes/Book";
import BookStore from "../stores/data/BookStore";
import DataService from "./DataService";
import db from "./Firestore";

export default class BookService extends DataService<BookPreviewInfo, BookDetailsInfo> {

    override previewsRef: CollectionReference<PreviewConstraint<BookPreviewInfo>>;

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