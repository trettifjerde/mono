import { action, computed, flow, makeObservable, observable, reaction } from "mobx";
import AuthorSlice from "../slices/AuthorSlice";
import { PreviewsQueryParams } from "../../services/DataService";
import { AuthorDetails, AuthorPreview } from "../../services/AuthorService";
import { FirestoreAuthor, FirestoreKeys } from "../../utils/firestoreDbTypes";
import { Pathnames } from "../../utils/consts";
import { makeAbsolutePath } from "../../utils/helpers";
import GridStore, { SelectSettings, SortConfig } from "./GridStore";
import AuthorPreviewItem from "../../components/AuthorPreviewItem";

export default class AuthorGrid extends GridStore<AuthorPreview, AuthorDetails> {

    override slice: AuthorSlice;
    override rootPath = makeAbsolutePath(Pathnames.authors);
    override entityTitleName = "author name";
    override ItemPreview = AuthorPreviewItem;

    override sortConfig = AuthorSortConfig;
    override sortSettings: SelectSettings<AuthorSortTypes> = {
        options: [],
        selectedOption: null
    };

    constructor(slice: AuthorSlice) {
        super();

        this.slice = slice;

        this.populateSortOptions();

        makeObservable(this, {
            defaultView: observable,
            filteredView: observable,
            sortSettings: observable,
            nameFilter: observable,
            currentView: computed,
            previews: computed,
            isStoreNotInitialised: computed,
            isNotInitialised: computed,
            isFull: computed,
            isLoading: computed,
            isError: computed,
            selectSortType: action.bound,
            applyNameFilter: action.bound,
            loadPreviews: flow.bound
        });

        reaction(
            () => [this.nameFilter, this.sortSettings.selectedOption], 
            (areAnyFiltersSelected) => {
                if (areAnyFiltersSelected.reduce((acc, v) => acc || !!v, false)) 
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
}

enum AuthorSortTypes {
    books = "books"
};

const AuthorSortConfig : SortConfig<AuthorSortTypes, FirestoreAuthor> = new Map([
    [
        AuthorSortTypes.books, {
            dbKey: FirestoreKeys.bookN,
            text: "Number of books",
            desc: 'desc'
        }
    ]
]);