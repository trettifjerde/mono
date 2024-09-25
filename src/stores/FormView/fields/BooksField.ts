import { action, computed, makeObservable, observable } from "mobx";
import { Field } from "mobx-react-form";
import { FieldConstructor } from "mobx-react-form/lib/models/FieldInterface";
import { DropdownOption } from "../../../utils/uiTypes";
import Book from "../../../utils/classes/Book";
import AuthorForm from "../forms/AuthorForm";
import DynamicSelectSettings from "../../../components/DynamicSelect/DynamicSelectSettings";

export default class BooksField extends Field {

    booktoDelete : Book | null = null;
    bookSearchSettings: DynamicSelectSettings<string>;

    constructor(props : FieldConstructor) {
        super(props);

        this.bookSearchSettings = new DynamicSelectSettings({
            fetchFn: this.fetchBooksWithoutAuthor.bind(this),
            onSelect: this.addBook.bind(this),
            resetOnSelect: true
        });

        makeObservable(this, {
            booktoDelete: observable,
            view: computed,
            bookStore: computed,
            books: computed,
            addBook: action.bound,
            confirmDelete: action.bound,
            removeBook: action.bound
        });
    }

    get view() {
        return (this.state.form as AuthorForm).view;
    }

    get bookStore() {
        return (this.state.form as AuthorForm).view.store.rootStore.books;
    }

    get books() {
        return this.bookStore.getCachedItemsById(this.value);
    }

    addBook(option: DropdownOption<string> | null) {
        if (option) 
            this.set(this.value.concat([option.value]));
    }

    removeBook(id: string) {
        this.set(this.value.filter((bookId : string) => bookId !== id));
        this.booktoDelete = null;
    }

    confirmDelete(item: Book | null) {
        this.booktoDelete = item || null;
    }

    async fetchBooksWithoutAuthor(titleStart: string) {
        
        return this.bookStore.getAuthorlessBooks({
            titleStart, 
            excludeBookIds: this.value
        })
        .then(suggestionBooks => {
            const author = this.view.loadedItem;
            if (author) {
                // if user has removed any current author books from the form, 
                // we need to include them in the dropdown so that they can add them back if they change their mind
                const formBookSet = new Set(this.value);
                author.books.forEach(book => {
                    if (!formBookSet.has(book.id) && book.name.toLowerCase().startsWith(titleStart))
                        suggestionBooks.push(book)
                });
            }
            return suggestionBooks.map(book => ({
                    text: book.name,
                    value: book.id
            }))
        })
        .catch((error) => {
            console.log(error);
            return null;
        })
    }

}