import { action, flow, makeObservable, reaction } from "mobx";
import { LoadingState, Pathnames } from "../../utils/consts";
import { makeAbsolutePath } from "../../utils/helpers";
import Author from "../../utils/classes/Author";
import AuthorForm, { AuthorFieldNames as AFN, AuthorFormShape } from "./forms/AuthorForm";
import AuthorStore from "../DataStore/AuthorStore";
import ItemLoader from "../ItemLoader";
import DefaultBookImgSrc from '../../assets/800x800.webp';

export default class AuthorFormView extends ItemLoader<Author> {

    override store: AuthorStore;
    form: AuthorForm;

    constructor(store: AuthorStore) {
        super(DefaultBookImgSrc);

        this.store = store;
        this.form = new AuthorForm(this);

        makeObservable(this, {
            submit: flow.bound,
            updateFields: action
        });

        reaction(
            () => ({initing: this.isInitialising, item: this.loadedItem}),
            ({initing, item}) => {
                if (!initing)
                    this.updateFields(item)
            }
        )
    }

    updateFields(author: Author | null) {
        const defaults = new Map<AFN, string | string[]>([
            [AFN.name, ''],
            [AFN.bio, '',],
            [AFN.img, '',],
            [AFN.bookIds, []],
        ]);

        if (author) {
            defaults.set(AFN.name, author.name);
            defaults.set(AFN.bio, author.description);
            defaults.set(AFN.img, author.img);
            defaults.set(AFN.bookIds, author.books.map(b => b.id));
        }

        defaults.forEach((value, key) => this.form.$(key).set('default', value));

        this.form.reset();
    }

    *submit(formData: AuthorFormShape) {

        this.state = LoadingState.pending;

        try {
            const authorId : string = yield this.loadedItem ?
                this.store.updateAuthor(this.loadedItem, formData) :
                this.store.postAuthor(formData)

            this.redirectPath = makeAbsolutePath(Pathnames.authors, authorId);
            this.state = LoadingState.idle;
        }
        catch (error) {
            this.state = LoadingState.error;
        }
    }
}