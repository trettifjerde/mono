import { ChangeEvent } from "react";
import { action, makeObservable, observable, reaction } from "mobx";
import { BookPreviewInfo, FirestoreKeys as FK } from "../../utils/firestoreDbTypes";
import { Pathnames } from "../../utils/consts";
import { BookDetailsInfo } from "../../utils/classes/Book";
import { SortConfig } from "./settings/SortSettings";
import { FilterConfig } from "./settings/FilterSettings";
import BookStore from "../DataStore/BookStore";
import PreviewsView, { BaseFilterTypes, NameFilterConfig } from "./PreviewsView";
import BookPreviewItem from "../../components/PreviewGrid/BookPreviewItem";
import DynamicSelectSettings from "../../components/DynamicSelect/DynamicSelectSettings";

export default class BookPreviewsView extends PreviewsView<
    BookPreviewInfo, BookDetailsInfo, BookFilterTypes, BookSortTypes
> {
    override store: BookStore;

    override pathname = Pathnames.books;
    override entityTitleName = "book title";
    override ItemPreview = BookPreviewItem;

    authorSettings : DynamicSelectSettings<string>;

    constructor(store: BookStore) {
        super(BookFilterConfig, BookSortConfig);

        this.store = store;
        this.authorSettings = new DynamicSelectSettings<string>(this.fetchAuthorSuggestions.bind(this));

        makeObservable(this, {
            authorSettings: observable,
            setInStockFilter: action.bound,
            fetchAuthorSuggestions: action.bound
        });

        reaction(
            () => this.authorSettings.selectedOption,
            (option) => {
                this.filterSettings.setFilter(BookFilterTypes.author, option?.value || '')
            }
        )
    }

    override setNameFilter(value: string): void {
        this.filterSettings.setFilter(BookFilterTypes.title, value);
    }

    setInStockFilter(e: ChangeEvent<HTMLInputElement>) {
        this.filterSettings.setFilter(BookFilterTypes.inStock, e.target.checked);
    }

    async fetchAuthorSuggestions(nameStart: string) {
        return this.store.rootStore.authors
            .getAuthorsByName(nameStart)
            .then(res => {
                if (res)
                    return {
                        suggestions: res.items.map(author => ({
                            text: author.previewInfo[FK.name],
                            value: author.id
                        })),
                        fromCache: res.fromCache
                    }
                return null;
            })
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