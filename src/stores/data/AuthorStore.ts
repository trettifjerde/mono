import RootStore from "../RootStore";
import DataStore from "./DataStore";
import AuthorService, { AuthorDetailsInfo, AuthorPreviewInfo } from "../../services/AuthorService";
import AuthorPreviewsView from "../previews/AuthorPreviewsView";
import AuthorDetailsView from "../details/AuthorDetailsView";
import Author from "../../utils/classes/Author";

export default class AuthorStore extends DataStore<AuthorPreviewInfo, AuthorDetailsInfo> {
    override entityName = "Author";
    override service : AuthorService;
    override previewsView: AuthorPreviewsView;
    override detailsView: AuthorDetailsView;

    override EntityConstructor = Author; 

    constructor(rootStore: RootStore) {
        super(rootStore);

        this.service = new AuthorService(this);
        this.previewsView = new AuthorPreviewsView(this);
        this.detailsView = new AuthorDetailsView(this);
    }
}