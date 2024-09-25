import { computed, makeObservable } from "mobx";
import Author from "../../utils/classes/Author";
import AuthorStore from "../DataStore/AuthorStore";
import DetailsView from "./DetailsView";

export default class AuthorDetailsView extends DetailsView<Author> {

    override store: AuthorStore;
    override HeaderComponent = null;

    constructor(store: AuthorStore) {
        super();
        this.store = store;

        makeObservable(this, {
            books: computed
        })
    }

    get books() {
        return this.loadedItem?.books || [];
    }  
}