import { action, computed, flow, makeObservable, observable, reaction } from "mobx";
import BookSlice from "../slices/BookSlice";
import { PreviewsQueryParams } from "../../services/DataService";
import { DetailsConstraint, FirestoreBook, FirestoreKeys } from "../../utils/firestoreDbTypes";
import GridStore, { SelectSettings, SortConfig } from "./GridStore";
import BookPreviewItem from "../../components/BookPreviewItem";

export default class BookGrid extends GridStore<FirestoreBook, DetailsConstraint> {
    override slice: BookSlice;

    override rootPath = "/";
    override entityTitleName = "book title";
    override ItemPreview = BookPreviewItem;

    override sortConfig = BookSortConfig;
    override sortSettings: SelectSettings<BookSortTypes> = {
        options: [],
        selectedOption: null
    };

    authorFilter: SelectSettings<string> = {
        options: [],
        selectedOption: null
    }
    inStockFilterOn = false;

    constructor(slice: BookSlice) {
        super();

        this.slice = slice;

        this.populateSortOptions();

        makeObservable(this, {
            defaultView: observable,
            filteredView: observable,
            sortSettings: observable,
            nameFilter: observable,
            authorFilter: observable,
            inStockFilterOn: observable,
            currentView: computed,
            isStoreNotInitialised: computed,
            selectSortType: action.bound,
            applyNameFilter: action.bound,
            applyInStockFilter: action.bound,
            loadPreviews: flow.bound
        });

        reaction(
            () => [
                this.nameFilter, 
                this.authorFilter.selectedOption?.value,
                this.inStockFilterOn,
                this.sortSettings.selectedOption?.value,
            ], 
            (areAnyFiltersSelected) => {
                if (areAnyFiltersSelected.reduce((acc, v) =>  acc || !!v, false)) 
                    this.applyFilters();
            }
        )
    }

    override get currentView() {
        return (this.sortSettings.selectedOption || this.nameFilter || 
            this.authorFilter.selectedOption || this.inStockFilterOn) ? 
            this.filteredView : this.defaultView;
    }

    override get queryParams(): PreviewsQueryParams {

        const params : PreviewsQueryParams = {
            filters: [],
            sorts: []
        }

        this.addSortAndPagination(params);

        if (this.authorFilter.selectedOption) {
            params.filters.push([FirestoreKeys.authorId, '==', this.authorFilter.selectedOption.value]);
            // params.sorts.push({key: FirestoreKeys.authorId});
        }

        this.addNameFilterParams(params);

        if (this.inStockFilterOn) {
            params.filters.push([FirestoreKeys.inStock, '>', 0]);
            params.sorts.push({key: FirestoreKeys.inStock, desc: 'desc'});
        }


        return params;
    }

    applyInStockFilter(checked: boolean) {
        this.inStockFilterOn = checked;
    }
}

enum BookSortTypes {
    priceHigh = "high",
    priceLow = "low"
};

const BookSortConfig : SortConfig<BookSortTypes, FirestoreBook> = new Map([[
    BookSortTypes.priceHigh, {
        dbKey: FirestoreKeys.price,
        text: "Price (high)",
        desc: 'desc',
    }], [
    BookSortTypes.priceLow, {
        dbKey: FirestoreKeys.price,
        text: "Price (low)",
    }]
]);

