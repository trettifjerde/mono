import { AuthorDetailsInfo, AuthorPreviewInfo } from "../../services/AuthorService";
import { Pathnames } from "../../utils/consts";
import { makeAbsolutePath } from "../../utils/helpers";
import { FilterConfig, SortConfig } from "../../utils/dataTypes";
import { FirestoreKeys } from "../../utils/firestoreDbTypes";
import PreviewsView, { BaseFilterTypes, NameFilterConfig } from "./PreviewsView";
import AuthorStore from "../data/AuthorStore";
import AuthorPreviewItem from "../../components/AuthorPreviewItem";

export default class AuthorPreviewsView extends PreviewsView<
    AuthorPreviewInfo, AuthorDetailsInfo, AuthorFilterTypes, AuthorSortTypes
> {

    override store: AuthorStore;
    override rootPath = makeAbsolutePath(Pathnames.authors);
    override entityTitleName = "author name";
    override ItemPreview = AuthorPreviewItem;

    constructor(store: AuthorStore) {
        super(AuthorFilterConfig, AuthorSortConfig);

        this.store = store;
    }

    override setNameFilter(value: string) {
        this.filterSettings.setFilter(AuthorFilterTypes.name, value);
    }
}

export enum AuthorSortTypes {
    books = "books"
};

export enum AuthorFilterTypes {
    name = BaseFilterTypes.name
}

export const AuthorSortConfig: SortConfig<AuthorSortTypes, AuthorPreviewInfo> = {
    [AuthorSortTypes.books]: {
        field: FirestoreKeys.bookN,
        text: 'Number of published books',
        desc: 'desc'
    }
}

const AuthorFilterConfig : FilterConfig<AuthorFilterTypes, AuthorPreviewInfo> = {
    [AuthorFilterTypes.name]: NameFilterConfig
}