import AuthorStore from "./DataStore/AuthorStore";
import BookStore from "./DataStore/BookStore";

export default class RootStore {

    books: BookStore;
    authors: AuthorStore

    constructor() {
        this.books = new BookStore(this);
        this.authors = new AuthorStore(this);
    }
}