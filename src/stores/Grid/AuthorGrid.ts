import { reaction } from "mobx";
import AuthorSlice from "../slices/AuthorSlice";
import { PreviewsQueryParams } from "../../services/DataService";
import { FirestoreKeys as FK } from "../../utils/firestoreDbTypes";
import { Pathnames } from "../../utils/consts";
import { makeAbsolutePath } from "../../utils/helpers";
import GridStore from "./GridStore";
import AuthorPreviewItem from "../../components/AuthorPreviewItem";
import Author from "../../utils/classes/Author";
import SelectView, { SortConfig } from "./SortSelect";
import { AuthorDetailsInfo, AuthorPreviewInfo } from "../../services/AuthorService";
import SortSelect from "./SortSelect";

export default class AuthorGrid extends GridStore<AuthorPreviewInfo, AuthorDetailsInfo> {

    override slice: AuthorSlice;
    override rootPath = makeAbsolutePath(Pathnames.authors);
    override entityTitleName = "author name";
    override ItemPreview = AuthorPreviewItem;

    override sortSelect: SelectView<AuthorPreviewInfo, AuthorSortTypes>;

    constructor(slice: AuthorSlice) {
        super();

        this.slice = slice;
        this.sortSelect = new SortSelect(AuthorSortConfig);

        reaction(
            () => [
                this.nameFilter, 
                this.sortSelect.selectedOption?.value,
            ], 
            (areAnyFiltersSelected) => {
                if (areAnyFiltersSelected.reduce((acc, v) =>  acc || !!v, false)) 
                    this.applyFilters();
            }
        )
    }

    override get queryParams(): PreviewsQueryParams {
        const params: PreviewsQueryParams = {
            filters: [],
            sorts: []
        };

        this.addNameFilterParams(params);
        this.addSortAndPagination(params);

        return params;
    }

    override get currentFilterFn() : (p: Author['preview']) => boolean {
        if (this.nameFilter)
            return (p) => p[FK.name_lowercase].startsWith(this.nameFilter);

        return () => true;
    }
}

enum AuthorSortTypes {
    books = "books"
};

const AuthorSortConfig : SortConfig<AuthorPreviewInfo, AuthorSortTypes> = new Map([
    [
        AuthorSortTypes.books, {
            dbKey: FK.bookN,
            text: "Number of books",
            desc: 'desc'
        }
    ]
]);