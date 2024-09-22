import { FirestoreKeys as FK } from "../utils/firestoreDbTypes";
import BookStore from "../stores/DataStore/BookStore";
import DataService from "./DataService";
import Book from "../utils/classes/Book";

export default class BookService extends DataService<Book> {

    constructor(store: BookStore) {
        super(store, FK.books, FK.descriptions);    
    }

    override async fetchDetails(id: string) {
        return this.fetchDescription(id)
            .then(description => ({description}))
    }
}