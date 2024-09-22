import { computed, makeObservable } from "mobx";
import Author from "../../utils/classes/Author";
import AuthorStore from "../DataStore/AuthorStore";
import DetailsView from "./DetailsView";
import DefaultBookImgSrc from '../../assets/800x800.webp';

export default class AuthorDetailsView extends DetailsView<Author> {

    override store: AuthorStore;
    override HeaderComponent = null;

    constructor(store: AuthorStore) {
        super(DefaultBookImgSrc);
        this.store = store;

        makeObservable(this, {
            books: computed
        })
    }

    get books() {
        return this.loadedItem?.books || [];
    }  
}