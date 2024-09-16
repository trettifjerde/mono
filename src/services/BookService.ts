import DataService from "./DataService";
import BookSlice from "../stores/slices/BookSlice";
import { DetailsConstraint, FirestoreBook, FirestoreKeys } from "../utils/firestoreDbTypes";
import { CollectionReference, DocumentData } from "firebase/firestore/lite";

export type BookPreviewInfo = FirestoreBook;
export type BookDetailsInfo = DetailsConstraint;

export default class BookService extends DataService<BookPreviewInfo, BookDetailsInfo> {

    override previewsRef: CollectionReference<BookPreviewInfo, DocumentData>;

    constructor(storeSlice: BookSlice) {
        super(storeSlice, FirestoreKeys.descriptions);    
        this.previewsRef = this.booksRef;
    }

    override async getDetails(id: string) {
        return this.getDescription(id)
            .then(description => ({description}))
    }
}