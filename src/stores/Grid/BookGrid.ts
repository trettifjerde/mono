import { action, computed, flow, makeObservable, observable } from "mobx";
import BookSlice from "../slices/BookSlice";
import { DBURLParams } from "../../services/DataService";
import GridStore, { CompareFn, FilterConfig } from "./GridStore";
import Book, { BookDetailsInfo, BookPreviewInfo } from "../../utils/classes/Book";
import { BookSortOptions, BookSortTypes } from "../../utils/dbTypes";
import { incrementStr } from "../../utils/helpers";
import BookPreviewItem from "../../components/BookPreviewItem";

export default class BookGrid extends GridStore<BookPreviewInfo, BookDetailsInfo> {
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
            currentView: computed,
            previews: computed,
            lastPreview: computed,
            isNotInitialised: computed,
            isFull: computed,
            isLoading: computed,
            isError: computed,
            setSortOption: action.bound,
            loadPreviews: flow.bound
        })
    }

    override getParamsAndSortFn() {

        const queryParams: DBURLParams = {};
        let sortFn: CompareFn<Book['previewInfo']>;
        let batchSizeExtentedBy = 0;

        const selectedValue = this.sortOptions.selectedOption?.value || null;

        switch (selectedValue) {
            case BookSortTypes.title:
                queryParams.orderBy = BookSortOptions[selectedValue].dbKey;
                queryParams.limitToFirst = this.batchSize;

                if (this.lastPreview)
                    queryParams.startAt = incrementStr(this.lastPreview.name);

                sortFn = (a, b) => a.previewInfo.name < b.previewInfo.name ? -1 : 1;
                break;

            case BookSortTypes.priceHigh:
            case BookSortTypes.priceLow:
                const {limit, at, fn} = this.getPriceParamsAndSortFn(selectedValue);
                
                queryParams.orderBy = BookSortOptions[selectedValue].dbKey;
                queryParams[limit] = this.batchSize;

                if (this.lastPreview) {
                    const batchSizeExtention = Array
                        .from(this.currentView.ids)
                        .map(id => this.slice.store.items.get(id))
                        .filter(item => item && item.preview.price === this.lastPreview.price)
                        .length;
                    batchSizeExtentedBy = batchSizeExtention;
                    queryParams[limit] += batchSizeExtention;
                    queryParams[at] = this.lastPreview.price;
                }
                sortFn = fn;
                break;

            default:
                queryParams.orderBy = '$key';
                queryParams.limitToFirst = this.batchSize;

                if (this.lastPreview)
                    queryParams.startAt = incrementStr(this.lastPreview.id);

                sortFn = (a, b) => a.id < b.id ? -1 : 1;
                break;
        }
        return {
            batchSizeExtentedBy,
            queryParams, 
            sortFn
        };
    }

    private getPriceParamsAndSortFn(selectedValue: BookSortTypes) : {
        limit: string,
        at: string,
        fn: CompareFn<Book['previewInfo']>
    } {
        return selectedValue === BookSortTypes.priceHigh ? {
            limit: 'limitToLast',
            at: 'endAt',
            fn: (a, b) => b.previewInfo.price - a.previewInfo.price
        } : {
            limit: 'limitToFirst',
            at: 'startAt',
            fn: (a, b) => a.previewInfo.price - b.previewInfo.price
        }
    }
}