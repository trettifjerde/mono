import RootStore from "../RootStore";
import StoreSlice from "./StoreSlice";
import AuthorService, { AuthorDetailsInfo, AuthorPreviewInfo } from "../../services/AuthorService";
import AuthorGrid from "../grid/AuthorGrid";
import Author from "../../utils/classes/Author";
import AuthorDetailsView from "../details/AuthorDetailsView";

export default class AuthorSlice extends StoreSlice<AuthorPreviewInfo, AuthorDetailsInfo> {

    override entityName = 'Author';
    override EntityConstructor = Author;
    override service : AuthorService;
    override grid: AuthorGrid;
    override details: AuthorDetailsView;

    constructor(rootStore: RootStore) {
        super(rootStore);

        this.grid = new AuthorGrid(this);
        this.details = new AuthorDetailsView(this);
        this.service = new AuthorService(this);
    }

}