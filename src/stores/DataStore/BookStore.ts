import { documentId, orderBy, where } from "firebase/firestore/lite";
import { FirestoreKeys as FK } from "../../utils/firestoreDbTypes";
import { getNameFilterConfig } from "../../utils/helpers";
import { FilterConfig, SortConfig } from "../../utils/dataTypes";
import { Pathnames } from "../../utils/consts";
import Book from "../../utils/classes/Book";
import RootStore from "../RootStore";
import DataStore from "./DataStore";
import BookService from "../../services/BookService";
import BookPreviewsView from "../PreviewsView/BookPreviewsView";
import BookDetailsView from "../DetailsView/BookDetailsView";
import FormView from "../FormView/FormView";
import BookForm, { BookFormShape } from "../FormView/forms/BookForm";
import DefaultBookImg from "../../assets/book.webp";

export default class BookStore extends DataStore<Book> {

    override entityName = "Book";
    override pathname = Pathnames.books;
    override fallbackImg = DefaultBookImg;
    override EntityConstructor = Book;
    override sortConfig = BookSortConfig;
    override filterConfig = BookFilterConfig;

    override service: BookService;
    override previewsView: BookPreviewsView;
    override detailsView: BookDetailsView;
    override formView: FormView<Book, BookForm>;

    constructor(rootStore: RootStore) {
        super(rootStore);

        this.service = new BookService(this);
        this.previewsView = new BookPreviewsView(this);
        this.detailsView = new BookDetailsView(this);
        this.formView = new FormView(this, BookForm);
    }

    override async postItem(formData: BookFormShape) {
        try {
            const {id, previewInfo, description, author} = await this.service.postItem(formData);

            const book = this.addToCache({id, previewInfo, detailsInfo: {description}})[0];

            if (author)
                author.addBook(book);

            this.previewsView.addPostedItem(book);
            this.rootStore.resetPreviewsViews();

            return id;
        }
        catch (error) {
            throw error;
        }
    }

    override async updateItem(initialItem: Book, formData: BookFormShape) {
        try {
            const id = initialItem.id;
            const {previewInfo, description, authorLog} = await this.service.updateItem(initialItem, formData);

            const updBook = this.updateCache({
                id, 
                previewInfo, 
                detailsInfo: {
                    description
                }})[0];

            if (!updBook)
                throw 'Book updated in DB, but not found in cache';

            if (authorLog.addedId)
                this.addToCachedAuthorBooks(authorLog.addedId, updBook);

            if (authorLog.removedId)
                this.removeFromCachedAuthorBooks(authorLog.removedId, id);
            
            this.rootStore.resetPreviewsViews();

            return id;
        }
        catch (error) {
            throw error;
        }
    }

    override async deleteItem(book: Book) {
        return super.deleteItem(book)
            .then(() => {
                if (book.authorInfo) 
                    this.removeFromCachedAuthorBooks(book.authorInfo.id, book.id);
            })
            .catch(error => {
                throw error
            })
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

            return this.filterFromCache(b => (
                filterTitle(b) &&
                !b.authorInfo &&
                !excludeSet.has(b.id)
            ));
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

            return items;
        }
        catch (error) {
            throw error;
        }
    }

    addToCachedAuthorBooks(authorId: string, book: Book) {
        const author = this.rootStore.authors.items.get(authorId);
        if (author) 
            author.addBook(book);
    }
    removeFromCachedAuthorBooks(authorId: string, bookId: string) {
        const author = this.rootStore.authors.items.get(authorId);
        if (author) 
            author.removeBook(bookId)
    }
}

export enum BookFilterTypes {
    title = "title",
    inStock = "inStock",
    author = "author"
}

export enum BookSortTypes {
    priceHigh = "high",
    priceLow = "low"
};

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