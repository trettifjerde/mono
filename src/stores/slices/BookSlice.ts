import StoreSlice from "./StoreSlice";
import BookService from "../../services/BookService";
import Book, { BookDetailsInfo, BookPreviewInfo } from "../../utils/classes/Book";

export default class BookSlice extends StoreSlice<BookPreviewInfo, BookDetailsInfo> {

    override entityName = 'Book';
    override EntityConstructor = Book;
    override service : BookService;

    constructor() {
        super({rootPath: "/"});

        this.service = new BookService();
    }

}