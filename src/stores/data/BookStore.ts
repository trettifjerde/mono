import { BookPreviewInfo, FirestoreKeys } from "../../utils/firestoreDbTypes";
import Book, { BookDetailsInfo } from "../../utils/classes/Book";
import RootStore from "../RootStore";
import DataStore from "./DataStore";
import BookService from "../../services/BookService";
import BookPreviewsView from "../previews/BookPreviewsView";
import BookDetailsView from "../details/BookDetailsView";

export default class BookStore extends DataStore<BookPreviewInfo, BookDetailsInfo> {

    override entityName = "Book";
    override EntityConstructor = Book;
    override service : BookService;
    override previewsView: BookPreviewsView;
    override detailsView: BookDetailsView;

    constructor(rootStore: RootStore) {
        super(rootStore);
        this.service = new BookService(this);
        this.previewsView = new BookPreviewsView(this);
        this.detailsView = new BookDetailsView(this);
    }

    async getAuthorBooks(authorId: string, all=false) {
        if (this.isCacheFull) {
            const authorBooks : Book[] = [];

            for (const book of this.items.values()) {
                if (book.previewInfo[FirestoreKeys.authorId] === authorId)
                    authorBooks.push()
            }
            return all ? authorBooks : authorBooks.slice(0, this.batchSize);
        }

        try {
            const {items: authorBooks} = await this.fetchAndCachePreviews({
                filters: [
                    {
                        field: FirestoreKeys.authorId, 
                        op:'==', 
                        value: authorId
                    }
                ],
                sorts: [],
                unlimited: all
            });

            return authorBooks;
        }
        catch (error) {
            return null;
        }
    }
}