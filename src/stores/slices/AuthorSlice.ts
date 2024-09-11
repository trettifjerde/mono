import StoreSlice from "./StoreSlice";
import AuthorService from "../../services/AuthorService";
import AuthorGrid from "../Grid/AuthorGrid";
import Author, { AuthorDetailsInfo, AuthorPreviewInfo } from "../../utils/classes/Author";

export default class AuthorSlice extends StoreSlice<AuthorPreviewInfo, AuthorDetailsInfo> {

    override entityName = 'Author';
    override EntityConstructor = Author;
    override service : AuthorService;
    override grid: AuthorGrid;

    constructor() {
        super();

        this.grid = new AuthorGrid(this);
        this.service = new AuthorService();
    }

}