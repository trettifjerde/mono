import RootStore from "../RootStore";
import StoreSlice from "./StoreSlice";
import BookService from "../../services/BookService";
import Book from "../../utils/classes/Book";
import BookGrid from "../grid/BookGrid";
import BookDetailsView from "../details/BookDetailsView";
import { DetailsConstraint, FirestoreBook } from "../../utils/firestoreDbTypes";

export default class BookSlice extends StoreSlice<FirestoreBook, DetailsConstraint> {

    override entityName = 'Book';
    override EntityConstructor = Book;
    override service : BookService;
    override grid: BookGrid;
    override details: BookDetailsView;

    constructor(rootStore: RootStore) {
        super(rootStore);

        this.grid = new BookGrid(this);
        this.details = new BookDetailsView(this);
        this.service = new BookService(this);
    }

}