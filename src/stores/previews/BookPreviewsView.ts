import { ChangeEvent } from "react";
import { action, makeObservable } from "mobx";
import { FirestoreKeys as FK } from "../../utils/firestoreDbTypes";
import { FilterConfig, SortConfig } from "../../utils/dataTypes";
import { BookDetailsInfo, BookPreviewInfo } from "../../services/BookService";
import BookStore from "../data/BookStore";
import PreviewsView, { BaseFilterTypes, NameFilterConfig } from "./PreviewsView";
import BookPreviewItem from "../../components/BookPreviewItem";

export default class BookPreviewsView extends PreviewsView<BookPreviewInfo, BookDetailsInfo, BookFilterTypes, BookSortTypes> {
    override store: BookStore;

    override rootPath = "/";
    override entityTitleName = "book title";
    override ItemPreview = BookPreviewItem;

    constructor(store: BookStore) {
        super(BookFilterConfig, BookSortConfig);

        this.store = store;

        makeObservable(this, {
            setAuthorFilter: action.bound,
            setInStockFilter: action.bound
        });
    }

    override setNameFilter(value: string): void {
        this.filterSettings.setFilter(BookFilterTypes.title, value);
    }

    setInStockFilter(e: ChangeEvent<HTMLInputElement>) {
        this.filterSettings.setFilter(BookFilterTypes.inStock, e.target.checked);
    }

    setAuthorFilter(authorId: string) {
        this.filterSettings.setFilter(BookFilterTypes.author, authorId);
    }
}

export enum BookSortTypes {
    priceHigh = "high",
    priceLow = "low"
};

export enum BookFilterTypes {
    title = BaseFilterTypes.name,
    inStock = "inStock",
    author = "author"
}

export const BookSortConfig: SortConfig<BookSortTypes, BookPreviewInfo> = {
    [BookSortTypes.priceLow]: {
        field: FK.price,
        text: 'Lowest price',
    },
    [BookSortTypes.priceHigh]: {
        field: FK.price,
        text: 'Highest price',
        desc: 'desc'
    }
};

export const BookFilterConfig: FilterConfig<BookFilterTypes, BookPreviewInfo> = {
    [BookFilterTypes.author]: {
        field: FK.authorId,
        initialValue: '',
        constraints: [
            { op: '==', makeValue: (v: string) => v }
        ]
    },
    [BookFilterTypes.title]: NameFilterConfig,
    [BookFilterTypes.inStock]: {
        field: FK.inStock,
        desc: 'desc',
        initialValue: false,
        constraints: [
            { op: '>', makeValue: () => 0 }
        ]
    }
};