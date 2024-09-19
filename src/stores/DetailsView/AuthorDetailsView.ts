import { computed, makeObservable } from "mobx";
import { AuthorPreviewInfo } from "../../utils/firestoreDbTypes";
import Author, { AuthorDetailsInfo } from "../../utils/classes/Author";
import AuthorStore from "../DataStore/AuthorStore";
import DetailsView from "./DetailsView";
import DefaultBookImgSrc from '../../assets/800x800.webp';

export default class AuthorDetailsView extends DetailsView<AuthorPreviewInfo, AuthorDetailsInfo> {

    override store: AuthorStore;
    override loadedItem: Author | null = null;
    override HeaderComponent = null;

    constructor(store: AuthorStore) {
        super(DefaultBookImgSrc);
        this.store = store;

        makeObservable(this, {
            bookPreviews: computed
        })
    }

    get bookPreviews() {
        return this.loadedItem?.books.map(book => book.preview) || [];
    }  
}