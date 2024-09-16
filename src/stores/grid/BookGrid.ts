import { ChangeEvent } from "react";
import { action, makeObservable, observable, reaction } from "mobx";
import BookSlice from "../slices/BookSlice";
import GridStore from "./GridStore";
import SortSelect, { SortConfig } from "./SortSelect";
import { BookDetailsInfo, BookPreviewInfo } from "../../services/BookService";
import Book from "../../utils/classes/Book";
import { FirestoreKeys as FK, PreviewsQueryParams } from "../../utils/firestoreDbTypes";
import BookPreviewItem from "../../components/BookPreviewItem";

export default class BookGrid extends GridStore<BookPreviewInfo, BookDetailsInfo> {
    override slice: BookSlice;

    override rootPath = "/";
    override entityTitleName = "book title";
    override ItemPreview = BookPreviewItem;

    override sortSelect: SortSelect<BookPreviewInfo, BookSortTypes>;

    // authorIdFilter: 
    inStockFilterOn = false;

    constructor(slice: BookSlice) {
        super();

        this.slice = slice;

        this.sortSelect = new SortSelect(BookSortConfig);

        makeObservable(this, {
            // authorIdFilter: observable,
            inStockFilterOn: observable,
            applyInStockFilter: action.bound
        });

        reaction(
            () => [
                this.nameFilter, 
                // this.authorIdFilter.selectedOption?.value,
                this.inStockFilterOn,
                this.sortSelect.selectedOption?.value,
            ], 
            (areAnyFiltersSelected) => {
                if (areAnyFiltersSelected.reduce((acc, v) =>  acc || !!v, false)) 
                    this.applyFilters();
            }
        )
    }

    override get currentView() {
        return (this.sortSelect.selectedOption || this.nameFilter || 
            this.sortSelect.selectedOption || this.inStockFilterOn) ? 
            this.filteredView : this.defaultView;
    }

    override get queryParams(): PreviewsQueryParams {

        const params : PreviewsQueryParams = {
            filters: [],
            sorts: []
        }

        this.addSortAndPagination(params);

        // if (this.authorIdFilter.selectedOption) {
        //     params.filters.push([FK.authorId, '==', this.authorIdFilter.selectedOption.value]);
        //     // params.sorts.push({key: FK.authorId});
        // }

        this.addNameFilterParams(params);

        if (this.inStockFilterOn) {
            params.filters.push([FK.inStock, '>', 0]);
            params.sorts.push({dbKey: FK.inStock, desc: 'desc'});
        }

        return params;
    }

    override get currentFilterFn() : (p: Book['preview']) => boolean {
        let filterFns : Array<(p: Book['preview']) => boolean> = [];

        // if (this.authorIdFilter.selectedOption) {
        //     const authorId = this.authorIdFilter.selectedOption.value;
        //     filterFns.push(p => p[FK.authorId] === authorId);
        // }
        if (this.nameFilter) 
            filterFns.push(p => p[FK.name_lowercase].startsWith(this.nameFilter));

        if (this.inStockFilterOn)
            filterFns.push(p => p[FK.inStock] > 0)

        return (p) => filterFns.reduce((acc, v) => acc && v(p), true);
    }

    applyInStockFilter(e: ChangeEvent<HTMLInputElement>) {
        this.inStockFilterOn = e.target.checked;
    }
}

enum BookSortTypes {
    priceHigh = "high",
    priceLow = "low"
};

const BookSortConfig : SortConfig<BookPreviewInfo, BookSortTypes> = new Map([[
    BookSortTypes.priceLow, {
            dbKey: FK.price,
            text: "Price",
            icon: 'icon-slim-arrow-up',
    }], [
    BookSortTypes.priceHigh, {
        dbKey: FK.price,
        text: "Price",
        icon: 'icon-slim-arrow-down',
        desc: 'desc',
    }]
]);

