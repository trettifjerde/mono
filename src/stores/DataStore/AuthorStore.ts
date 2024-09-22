import {FirestoreKeys } from "../../utils/firestoreDbTypes";
import { getNameFilterConfig } from "../../utils/helpers";
import { FilterConfig, SortConfig } from "../../utils/dataTypes";
import { AuthorFormShape } from "../FormView/forms/AuthorForm";
import Author from "../../utils/classes/Author";
import RootStore from "../RootStore";
import DataStore from "./DataStore";
import AuthorService from "../../services/AuthorService";
import AuthorPreviewsView from "../PreviewsView/AuthorPreviewsView";
import AuthorDetailsView from "../DetailsView/AuthorDetailsView";
import AuthorFormView from "../FormView/AuthorFormView";

export default class AuthorStore extends DataStore<Author> {
    override entityName = "Author";
    override EntityConstructor = Author;
    override sortConfig = AuthorSortConfig;
    override filterConfig = AuthorFilterConfig

    override service: AuthorService;
    override previewsView: AuthorPreviewsView;
    override detailsView: AuthorDetailsView;

    formView: AuthorFormView;

    constructor(rootStore: RootStore) {
        super(rootStore);

        this.service = new AuthorService(this);
        this.previewsView = new AuthorPreviewsView(this);
        this.detailsView = new AuthorDetailsView(this);
        this.formView = new AuthorFormView(this);
    }

    async updateAuthor(initialItem: Author, formData: AuthorFormShape) {
        try {
            const {previewInfo, description, booksAdded, booksKept, booksRemoved} = await this.service
                .updateAuthor(initialItem, formData);
            
            const id = initialItem.id;
            const { name } = previewInfo || initialItem;

            const bookStore = this.rootStore.books;

            const updAuthor = this.updateCache({
                id,
                previewInfo,
                detailsInfo: {
                    description,
                    books: bookStore.updateCachedAuthorInfo(
                        [...booksAdded, ...booksKept],
                        {name, id}
                    )
                }
            })[0];

            if (!updAuthor)
                throw 'Updated author in the database, but failed to update the cache';

            this.previewsView.clearFilters();
            bookStore.previewsView.clearFilters();
            bookStore.updateCachedAuthorInfo(booksRemoved, null);

            return updAuthor.id;
        }
        catch (error) {
            throw error;
        }
    }

    async postAuthor(formData: AuthorFormShape) {

        try {
            const { id, previewInfo, description, bookIds } = await this.service.postAuthor(formData);
            const bookStore = this.rootStore.books;

            const books = bookStore.updateCachedAuthorInfo(bookIds, { 
                    id,
                    name: previewInfo.name
                })
                .filter(book => !!book);

            this.addToCache({
                id, 
                previewInfo, 
                detailsInfo: {
                    description,
                    books
                }
            });

            this.previewsView.clearFilters();
            bookStore.previewsView.clearFilters();

            return id;
        }
        catch (error) {
            throw error;
        }
    }

    async getAuthorsByName(nameStart: string) {

        const nameConfig = this.filterConfig.name;

        if (this.isCacheFull) {
            const nameFilterFn = nameConfig.makeFilterFn(nameStart);

            return {
                items: Array.from(this.items.values())
                    .filter(nameFilterFn)
                    .slice(0, this.batchSize),
                fromDataStoreCache: true
            }
        }

        try {
            const {filters, sort} = nameConfig.makeConstraints(nameStart);
            const { items } = await this.fetchAndCachePreviews({
                filters,
                sorts: [sort]
            });

            return {
                items,
                fromDataStoreCache: false
            }
        }
        catch (error) {
            throw error
        }
    }
}

export enum AuthorFilterTypes {
    name = "name"
}

const AuthorFilterConfig : FilterConfig<AuthorFilterTypes, Author> = {
    [AuthorFilterTypes.name]: getNameFilterConfig<Author>()
}

export enum AuthorSortTypes {
    books = "books"
};

export const AuthorSortConfig: SortConfig<AuthorSortTypes, Author> = {
    [AuthorSortTypes.books]: {
        field: FirestoreKeys.bookN,
        text: 'Number of published books',
        desc: 'desc'
    }
}