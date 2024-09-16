import BookSlice from "./slices/BookSlice";
import AuthorSlice from "./slices/AuthorSlice";

export default class RootStore {

    books: BookSlice;
    authors: AuthorSlice

    constructor() {
        this.books = new BookSlice(this);
        this.authors = new AuthorSlice(this);
    }
}