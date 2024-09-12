import StoreSlice from "./StoreSlice";
import BookService from "../../services/BookService";
import Book from "../../utils/classes/Book";
import BookGrid from "../Grid/BookGrid";
import { DetailsConstraint, FirestoreBook } from "../../utils/firestoreDbTypes";

export default class BookSlice extends StoreSlice<FirestoreBook, DetailsConstraint> {

    override entityName = 'Book';
    override EntityConstructor = Book;
    override service : BookService;
    override grid: BookGrid;

    constructor() {
        super();

        this.grid = new BookGrid(this);
        this.service = new BookService();
    }

}