import { action, computed, flow, makeObservable, observable } from "mobx";
import { documentId } from "firebase/firestore/lite";
import BookSlice from "../slices/BookSlice";
import { PreviewsQueryParams } from "../../services/DataService";
import GridStore, { FilterConfig } from "./GridStore";
import { DetailsConstraint, FirestoreBook, FirestoreKeys } from "../../utils/firestoreDbTypes";
import BookPreviewItem from "../../components/BookPreviewItem";

export default class BookGrid extends GridStore<FirestoreBook, DetailsConstraint> {
    override slice: BookSlice;

    override rootPath = "/";
    override entityTitleName = "book title";
    override ItemPreview = BookPreviewItem;

    override sortOptions: FilterConfig<BookSortTypes> = {
        name: 'sort',
        label: 'Sort by',
        placeholder: 'Select type',
        options: Object.entries(BookSortOptions)
            .map(([key, {text}]) => (
                {value: key as BookSortTypes, text}
            )),
        selectedOption: null            
    }

    override get queryParams(): PreviewsQueryParams {
        const params : PreviewsQueryParams = {};

        if (this.filterString) {
            params.filters = [[FirestoreKeys.name_lowercase, this.filterString]];
        }

        const sortOption = this.sortOptions.selectedOption?.value;

        if (sortOption) {
            const {dbKey, isDesc} = BookSortOptions[sortOption];
            params.sort = {dbKey, isDesc};

            if (this.lastPreview) {
                params.lastItemValue = this.lastPreview[dbKey];
            }  
        }
        else {
            params.sort = {dbKey: documentId(), isDesc: false};
            
            if (this.lastPreview) {
                params.lastItemValue = this.lastPreview.id;
            }
        }

        return params;
    }

    constructor(slice: BookSlice) {
        super();

        this.slice = slice;

        this.sortOptions.options = Object
            .entries(BookSortOptions)
            .map(([key, info]) => ({value: key as BookSortTypes, text: info.text}))

        makeObservable(this, {
            mainView: observable,
            filteredView: observable,
            sortOptions: observable,
            filterString: observable,
            currentView: computed,
            previews: computed,
            lastPreview: computed,
            isNotInitialised: computed,
            isFull: computed,
            isLoading: computed,
            isError: computed,
            setSortOption: action.bound,
            applyFilterString: action.bound,
            loadPreviews: flow.bound
        })
    }
}

export enum BookSortTypes {
    title = "title",
    priceHigh = "high",
    priceLow = "low"
};

export const BookSortOptions = {
    [BookSortTypes.title]: {
        dbKey: FirestoreKeys.name_lowercase as keyof FirestoreBook,
        isDesc: false,
        text: "Book title",
    },
    [BookSortTypes.priceHigh]: {
        dbKey: FirestoreKeys.price as keyof FirestoreBook,
        isDesc: true,
        text: "Price (high)",
    },
    [BookSortTypes.priceLow]: {
        dbKey: FirestoreKeys.price as keyof FirestoreBook,
        isDesc: false,
        text: "Price (low)",
    }
}