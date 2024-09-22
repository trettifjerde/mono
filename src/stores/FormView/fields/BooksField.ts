import { action, computed, makeObservable, observable } from "mobx";
import { Field } from "mobx-react-form";
import { FieldConstructor } from "mobx-react-form/lib/models/FieldInterface";
import { DropdownOption } from "../../../utils/uiTypes";
import AuthorForm from "../forms/AuthorForm";
import DynamicSelectSettings from "../../../components/DynamicSelect/DynamicSelectSettings";
import Book from "../../../utils/classes/Book";

export default class BooksField extends Field {

    bookIdToDelete : string | null = null;
    bookSearchSettings: DynamicSelectSettings<string>;

    constructor(props : FieldConstructor) {
        super(props);

        this.bookSearchSettings = new DynamicSelectSettings({
            fetchFn: this.fetchBooksWithoutAuthor.bind(this),
            onSelect: this.addBook.bind(this),
            selectNull: false,
            clearFilter: true
        });

        makeObservable(this, {
            bookIdToDelete: observable,
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
        if (option) {
            this.value = [...this.value, option.value];
            this.bookSearchSettings.clear();
        }
    }

    confirmDelete(item: Book | null) {
        this.bookIdToDelete = item?.id || null;
    }

    removeBook(id: string) {
        this.value = this.value.filter((bookId : string) => bookId !== id);
        this.bookIdToDelete = null;
        this.bookSearchSettings.clear();
    }

    async fetchBooksWithoutAuthor(titleStart: string) {
        
        return this.bookStore.getAuthorlessBooks({
            titleStart, 
            excludeBookIds: this.value
        })
        .then(({items, fromDataStoreCache}) => {
            const author = this.view.loadedItem;
            if (author) {
                // if user has removed any current author books from the form, 
                // we need to include them in the dropdown so that they can add them back if they change their mind
                const formBookSet = new Set(this.value);
                author.books.forEach(book => {
                    if (!formBookSet.has(book.id) && book.name.toLowerCase().startsWith(titleStart))
                        items.push(book)
                });
            }
            return {
                suggestions: items.map(book => ({
                    text: book.name,
                    value: book.id
                })),
                fromDataStoreCache
            }
        })
        .catch((error) => {
            console.log(error);
            return null;
        })
    }

}