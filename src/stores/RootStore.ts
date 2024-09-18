import AuthorStore from "./data/AuthorStore";
import BookStore from "./data/BookStore";

export default class RootStore {

    books: BookStore;
    authors: AuthorStore

    constructor() {
        this.books = new BookStore(this);
        this.authors = new AuthorStore(this);
    }
}