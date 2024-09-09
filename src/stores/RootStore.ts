import BookSlice from "./slices/BookSlice";
import AuthorSlice from "./slices/AuthorSlice";

export default class RootStore {

    books: BookSlice;
    authors: AuthorSlice

    constructor() {
        this.books = new BookSlice();
        this.authors = new AuthorSlice();
    }
}