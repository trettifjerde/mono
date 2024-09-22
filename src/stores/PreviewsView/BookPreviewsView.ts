import { ChangeEvent } from "react";
import { action, computed, makeObservable } from "mobx";
import { Pathnames } from "../../utils/consts";
import { DropdownOption } from "../../utils/uiTypes";
import Book from "../../utils/classes/Book";
import BookStore, { BookFilterTypes, BookSortTypes } from "../DataStore/BookStore";
import PreviewsView from "./PreviewsView";
import DynamicSelectSettings from "../../components/DynamicSelect/DynamicSelectSettings";
import BookPreview from "../../components/BookPreview";

export default class BookPreviewsView extends PreviewsView<Book, BookFilterTypes, BookSortTypes
> {
    override pathname = Pathnames.books;
    override entityTitleName = "book title";
    override ItemPreview = BookPreview;

    authorSettings : DynamicSelectSettings<string>;

    constructor(store: BookStore) {
        super(store);
        
        this.authorSettings = new DynamicSelectSettings<string>({
            fetchFn: this.fetchAuthorSuggestions.bind(this),
            onSelect: this.setAuthorFilter.bind(this),
            selectNull: true,
            clearFilter: false
        });

        makeObservable(this, {
            inStockFilter: computed,
            setInStockFilter: action.bound,
            setAuthorFilter: action.bound
        });
    }

    override get nameFilter() {
        return this.filterSettings.filters.get(BookFilterTypes.title)?.toString() || '';
    }

    override setNameFilter(value: string): void {
        this.filterSettings.setFilter(BookFilterTypes.title, value);
    }

    override clearFilters() {
        super.clearFilters();
        this.authorSettings.clear();
    }

    get inStockFilter() {
        return !!this.filterSettings.filters.get(BookFilterTypes.inStock);
    }

    setInStockFilter(e: ChangeEvent<HTMLInputElement>) {
        this.filterSettings.setFilter(BookFilterTypes.inStock, e.target.checked);
    }

    setAuthorFilter(option: DropdownOption<string> | null) {
        this.filterSettings.setFilter(BookFilterTypes.author, option?.value || '')
    }

    async fetchAuthorSuggestions(nameStart: string) {
        return this.store.rootStore.authors.getAuthorsByName(nameStart)
            .then(({items, fromDataStoreCache}) => ({
                suggestions: items.map(author => ({
                    text: author.name,
                    value: author.id
                })),
                fromDataStoreCache
            }))
            .catch(() => null)
    }
}