import Book from "../../utils/classes/Book";
import BookStore from "../DataStore/BookStore";
import DetailsView from "./DetailsView";
import BookHeader from "../../pages/BookDetailsPage/BookHeader";

export default class BookDetailsView extends DetailsView<Book> {

    override store : BookStore;
    override HeaderComponent = BookHeader;

    constructor(store: BookStore) {
        super();
        this.store = store;
    }

}