import StoreSlice from "./StoreSlice";
import BookService from "../../services/BookService";
import Book, { BookDetailsInfo, BookPreviewInfo } from "../../utils/classes/Book";
import BookGrid from "../Grid/BookGrid";

export default class BookSlice extends StoreSlice<BookPreviewInfo, BookDetailsInfo> {

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