import StoreSlice from "./StoreSlice";
import AuthorService from "../../services/AuthorService";
import Author, { AuthorDetailsInfo, AuthorPreviewInfo } from "../../utils/classes/Author";
import { Pathnames } from "../../utils/consts";
import { makeAbsolutePath } from "../../utils/helpers";

export default class AuthorSlice extends StoreSlice<AuthorPreviewInfo, AuthorDetailsInfo> {

    override entityName = 'Author';
    override EntityConstructor = Author;
    override service : AuthorService;

    constructor() {
        super({rootPath: makeAbsolutePath(Pathnames.authors)});

        this.service = new AuthorService();
    }

}