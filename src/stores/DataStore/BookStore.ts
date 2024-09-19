import { BookPreviewInfo, FirestoreKeys as FK } from "../../utils/firestoreDbTypes";
import Book, { BookDetailsInfo } from "../../utils/classes/Book";
import RootStore from "../RootStore";
import DataStore from "./DataStore";
import BookService from "../../services/BookService";
import BookPreviewsView from "../PreviewsView/BookPreviewsView";
import BookDetailsView from "../DetailsView/BookDetailsView";
import { makeNameFilter } from "../../utils/helpers";
import { documentId, WhereFilterOp } from "firebase/firestore/lite";

export default class BookStore extends DataStore<BookPreviewInfo, BookDetailsInfo, Book> {

    override entityName = "Book";
    override EntityConstructor = Book;
    override service: BookService;
    override previewsView: BookPreviewsView;
    override detailsView: BookDetailsView;

    constructor(rootStore: RootStore) {
        super(rootStore);
        this.service = new BookService(this);
        this.previewsView = new BookPreviewsView(this);
        this.detailsView = new BookDetailsView(this);
    }

    async getBooksWithoutAuthor(titleStart: string, excludeIds: string[]) {
        if (this.isCacheFull) {
            const books = this.filterFromCache(b => (
                !b.previewInfo[FK.authorId] &&
                b.previewInfo[FK.name_lowercase].startsWith(titleStart) &&
                !excludeIds.some(id => id === b.id) 
            ))

            return {
                books,
                fromCache: true
            }
        }

        const info = await this.fetchAndCachePreviews({
            filters: [
                {
                    field: FK.authorId,
                    op: '==',
                    value: null
                },
                ...makeNameFilter<BookPreviewInfo>(titleStart),
                ...excludeIds.map(id => ({
                    field: documentId(),
                    op: '!=' as WhereFilterOp,
                    value: id
                }))
            ],
            sorts: [{field: FK.name_lowercase}]
        });

        if (info) {
            return {
                books: info.items,
                fromCache: false
            }
        }
    }

    async getAuthorBooks(authorId: string, clip = true) {
        if (this.isCacheFull) 
            return this.filterFromCache(book => (
                book.previewInfo[FK.authorId] === authorId
            ), clip)

        const info = await this.fetchAndCachePreviews({
            filters: [
                {
                    field: FK.authorId,
                    op: '==',
                    value: authorId
                }
            ],
            sorts: [],
            clip
        });

        if (info)
            return info.items;

        return null;
    }

    updateAuthorInfo(bookIds: string[], authorInfo: {authorName: string, authorId: string}) {
        const updBooks : Array<Book|null> = [];
        const {authorId, authorName} = authorInfo;

        for (const bookId of bookIds) {
            const book = this.items.get(bookId);
            if (book) {
                book.previewInfo[FK.authorId] = authorId,
                book.previewInfo[FK.authorName] = authorName;
                updBooks.push(book);
            }
            else {
                updBooks.push(null);
            }
        }
        return updBooks;
    }
}