import { Pathnames } from "../../utils/consts";
import Author from "../../utils/classes/Author";
import AuthorStore, { AuthorFilterTypes, AuthorSortTypes } from "../DataStore/AuthorStore";
import PreviewsView from "./PreviewsView";
import AuthorPreview from "../../components/AuthorPreview";

export default class AuthorPreviewsView extends PreviewsView<Author, AuthorFilterTypes, AuthorSortTypes
> {
    
    override pathname = Pathnames.authors;
    override entityTitleName = "author name";
    override ItemPreview = AuthorPreview;

    constructor(store: AuthorStore) {
        super(store);
    }

    override get nameFilter() {
        return this.filterSettings.filters.get(AuthorFilterTypes.name)?.toString() || '';
    }

    override setNameFilter(value: string) {
        this.filterSettings.setFilter(AuthorFilterTypes.name, value);
    }
}