import { AuthorPreviewInfo } from "../../utils/firestoreDbTypes";
import Author, { AuthorDetailsInfo } from "../../utils/classes/Author";
import RootStore from "../RootStore";
import DataStore from "./DataStore";
import AuthorService from "../../services/AuthorService";
import AuthorPreviewsView from "../previews/AuthorPreviewsView";
import AuthorDetailsView from "../details/AuthorDetailsView";

export default class AuthorStore extends DataStore<AuthorPreviewInfo, AuthorDetailsInfo, Author> {
    override entityName = "Author";
    override EntityConstructor = Author;
    override service : AuthorService;
    override previewsView: AuthorPreviewsView;
    override detailsView: AuthorDetailsView;

    constructor(rootStore: RootStore) {
        super(rootStore);

        this.service = new AuthorService(this);
        this.previewsView = new AuthorPreviewsView(this);
        this.detailsView = new AuthorDetailsView(this);
    }
}