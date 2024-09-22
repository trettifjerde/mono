import { documentId, orderBy, where } from "firebase/firestore/lite";
import { FirestoreKeys as FK } from "../../utils/firestoreDbTypes";
import { getNameFilterConfig } from "../../utils/helpers";
import { FilterConfig, SortConfig } from "../../utils/dataTypes";
import Book, { BookAuthorInfo } from "../../utils/classes/Book";
import RootStore from "../RootStore";
import DataStore from "./DataStore";
import BookService from "../../services/BookService";
import BookPreviewsView from "../PreviewsView/BookPreviewsView";
import BookDetailsView from "../DetailsView/BookDetailsView";

export default class BookStore extends DataStore<Book> {

    override entityName = "Book";
    override EntityConstructor = Book;
    override sortConfig = BookSortConfig;
    override filterConfig = BookFilterConfig;

    override service: BookService;
    override previewsView: BookPreviewsView;
    override detailsView: BookDetailsView;

    constructor(rootStore: RootStore) {
        super(rootStore);

        this.service = new BookService(this);
        this.previewsView = new BookPreviewsView(this);
        this.detailsView = new BookDetailsView(this);
    }

    updateCachedAuthorInfo(bookIds: string[], authorInfo: BookAuthorInfo | null) {
        const books = this.getCachedItemsById(bookIds);
        books.forEach(book => book.setAuthorInfo(authorInfo));
        return books;
    }

    async getBooksByAuthorId(authorId: string) {

        const authorConfig = this.filterConfig.author;

        if (this.isCacheFull)
            return this.filterFromCache(authorConfig.makeFilterFn(authorId), true);

        const {filters, sort} = authorConfig.makeConstraints(authorId);

        return this.fetchAndCachePreviews({
                filters,
                sorts: [sort],
                unlimited: true
            })
            .then(({items}) => items)
    }

    async getAuthorlessBooks({titleStart, excludeBookIds}: {
        titleStart: string, 
        excludeBookIds: string[]
    }) {

        const authorConfig = this.filterConfig.author;
        const titleConfig = this.filterConfig.title;

        if (this.isCacheFull) {
            const filterTitle = titleConfig.makeFilterFn(titleStart);
            const excludeSet = new Set(excludeBookIds);

            return {
                items: this.filterFromCache(b => (
                    filterTitle(b) &&
                    !b.authorInfo &&
                    !excludeSet.has(b.id)
                )),
                fromDataStoreCache: true
            }
        }

        try {
            const titleConstraints = titleConfig.makeConstraints(titleStart);

            const filters = [
                where(FK.authorId, '==', null),
                ...titleConstraints.filters
            ];

            if (excludeBookIds.length)
                filters.push(where(documentId(), 'not-in', excludeBookIds));

            const { items } = await this.fetchAndCachePreviews({
                filters,
                sorts: [
                    titleConstraints.sort,
                    authorConfig.makeConstraints('').sort,
                ]
            });

            return {
                items,
                fromDataStoreCache: false
            }
        }
        catch (error) {
            throw error;
        }
    }
}

export enum BookFilterTypes {
    title = "title",
    inStock = "inStock",
    author = "author"
}

const BookFilterConfig: FilterConfig<BookFilterTypes, Book> = {
    [BookFilterTypes.author]: {
        initialValue: '',
        makeFilterFn: (authorId: string) => (book) => book.authorInfo?.id === authorId,
        makeConstraints: (authorId: string) => ({
            filters: [where(FK.authorId, '==', authorId)],
            sort: orderBy(FK.authorId)
        })
    },

    [BookFilterTypes.title]: getNameFilterConfig<Book>(),

    [BookFilterTypes.inStock]: {
        initialValue: false,
        makeFilterFn: () => (book) => book.inStock > 0,
        makeConstraints: () => ({
            filters: [where(FK.inStock, '>', 0)],
            sort: orderBy(FK.inStock, 'desc')
        })
    }
};

export enum BookSortTypes {
    priceHigh = "high",
    priceLow = "low"
};

export const BookSortConfig: SortConfig<BookSortTypes, Book> = {
    [BookSortTypes.priceLow]: {
        field: FK.price,
        text: 'Lowest price',
    },
    [BookSortTypes.priceHigh]: {
        field: FK.price,
        desc: 'desc',
        text: 'Highest price'
    }
};