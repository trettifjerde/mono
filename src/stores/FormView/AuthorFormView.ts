import { computed, flow, makeObservable, observable, reaction } from "mobx";
import { LoadingState, Pathnames } from "../../utils/consts";
import { makeAbsolutePath } from "../../utils/helpers";
import { AuthorFieldNames, AuthorFormShape } from "./configs/authorConfig";
import { AuthorPreviewInfo, FirestoreAuthor, FirestoreKeys } from "../../utils/firestoreDbTypes";
import { AuthorDetailsInfo } from "../../utils/classes/Author";
import AuthorStore from "../DataStore/AuthorStore";
import AuthorForm from "./forms/AuthorForm";
import ItemLoaderView from "../ItemLoaderView";
import DynamicSelectSettings from "../../components/DynamicSelect/DynamicSelectSettings";
import Book from "../../utils/classes/Book";
import DefaultBookImgSrc from '../../assets/800x800.webp';

export default class AuthorFormView extends ItemLoaderView<AuthorPreviewInfo, AuthorDetailsInfo> {

    override store : AuthorStore;

    books: Book[] = [];
    bookSearchSettings: DynamicSelectSettings<string>;
    form : AuthorForm;
    submittedItemPath: string | null = null;

    constructor(store: AuthorStore) {
        super(DefaultBookImgSrc);

        this.store = store;
        this.form = new AuthorForm(this);
        this.bookSearchSettings = new DynamicSelectSettings(
            this.fetchBooksWithoutAuthor.bind(this),
            true
        );

        makeObservable(this, {
            books: observable,
            bookSearchSettings: observable,
            form: observable,
            submittedItemPath: observable,
            bookPreviews: computed,
            submit: flow.bound
        });

        reaction(
            () => this.bookSearchSettings.selectedOption,
            (option) => {
                if (option) {
                    const book = this.store.rootStore.books.items.get(option.value);
                    if (book) {
                        this.books.push(book);
                        this.form.$(AuthorFieldNames.books).add(book.id);
                    }
                }
            }
        )
    }

    get bookPreviews() {
        return this.books.map(b => b.preview);
    }

    *submit(values: AuthorFormShape) {
        const {name, books, bio, img} = values;
        const bookIds = typeof books === 'string' ? [] : books;

        const previewInfo : FirestoreAuthor = {
            [FirestoreKeys.name]: name,
            [FirestoreKeys.name_lowercase]: name.toLowerCase(),
            [FirestoreKeys.bookN]: bookIds.length,
            [FirestoreKeys.img]: img
        };
        const description = bio;

        this.state = LoadingState.loading;

        try {
            const authorId : string | null = yield this.store.postAuthor({ previewInfo, description, bookIds});

            if (authorId) {
                this.submittedItemPath = makeAbsolutePath(Pathnames.authors, authorId);
                this.state = LoadingState.idle;
            }
            else 
                throw authorId;

        }
        catch (error) {
            this.state = LoadingState.error;
        }
    }

    async fetchBooksWithoutAuthor(nameStart: string) {
        const excludeIds = this.books.map(b => b.id);
        
        return this.store.rootStore.books.getBooksWithoutAuthor(nameStart, excludeIds)
            .then(res => {
                if (!res) 
                    return null;

                const {books, fromCache} = res;
                return {
                    suggestions: books.map(b => ({
                        text: b.previewInfo[FirestoreKeys.name],
                        value: b.id
                    })),
                    fromCache
                }
            })
    }
}