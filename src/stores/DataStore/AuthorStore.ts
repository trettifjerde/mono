import {FirestoreKeys } from "../../utils/firestoreDbTypes";
import { Pathnames } from "../../utils/consts";
import { getNameFilterConfig } from "../../utils/helpers";
import { FilterConfig, SortConfig } from "../../utils/dataTypes";
import { BookAuthorInfo } from "../../utils/classes/Book";
import Author from "../../utils/classes/Author";
import RootStore from "../RootStore";
import DataStore from "./DataStore";
import AuthorService from "../../services/AuthorService";
import AuthorPreviewsView from "../PreviewsView/AuthorPreviewsView";
import AuthorDetailsView from "../DetailsView/AuthorDetailsView";
import AuthorForm, { AuthorFormShape } from "../FormView/forms/AuthorForm";
import FormView from "../FormView/FormView";
import DefaultAuthorImg from '../../assets/author.webp';

export default class AuthorStore extends DataStore<Author> {
    override entityName = "Author";
    override pathname = Pathnames.authors;
    override fallbackImg = DefaultAuthorImg;
    override EntityConstructor = Author;
    override sortConfig = AuthorSortConfig;
    override filterConfig = AuthorFilterConfig

    override service: AuthorService;
    override previewsView: AuthorPreviewsView;
    override detailsView: AuthorDetailsView;
    override formView: FormView<Author, AuthorForm>;

    constructor(rootStore: RootStore) {
        super(rootStore);

        this.service = new AuthorService(this);
        this.previewsView = new AuthorPreviewsView(this);
        this.detailsView = new AuthorDetailsView(this);
        this.formView = new FormView(this, AuthorForm);
    }

    override async postItem(formData: AuthorFormShape) {
        try {
            const { id, previewInfo, description, bookIds } = await this.service.postItem(formData);

            const author = this.addToCache({
                id, 
                previewInfo, 
                detailsInfo: {
                    description,
                    books: this.updateCachedAuthorInfo(bookIds, { 
                        id,
                        name: previewInfo.name
                    })
                }
            })[0];

            this.updatePreviewsViewWith(author);

            return id;
        }
        catch (error) {
            throw error;
        }
    }

    override async updateItem(initialItem: Author, formData: AuthorFormShape) {
        try {
            const {previewInfo, description, bookChangeLog} = await this.service
                .updateItem(initialItem, formData);
            
            const id = initialItem.id;
            const {name} = previewInfo || initialItem;

            const updAuthor = this.updateCache({
                id,
                previewInfo,
                detailsInfo: {
                    description,
                    books: this.updateCachedAuthorInfo(
                        [...bookChangeLog.added, ...bookChangeLog.kept],
                        { id, name }
                    )
                }
            })[0];

            if (!updAuthor)
                throw 'Updated author in the database, but failed to update the cache';

            this.updateCachedAuthorInfo(bookChangeLog.removed, null);
            this.rootStore.resetPreviewsViews();

            return updAuthor.id;
        }
        catch (error) {
            throw error;
        }
    }

    override async deleteItem(author: Author) {

        return super.deleteItem(author)
            .then(() => {
                this.updateCachedAuthorInfo(author.books.map(b => b.id), null);
            })
            .catch(error => {
                throw error
            })
    }

    async getAuthorSuggestionsByName(nameStart: string) {

        return new Promise<Author[]>(async (resolve, reject) => {

            const nameConfig = this.filterConfig.name;

            if (this.isCacheFull) {
                const nameFilterFn = nameConfig.makeFilterFn(nameStart);

                const items : Author[] = [];

                for (const author of this.items.values()) {
                    if (nameFilterFn(author)) {

                        items.push(author);

                        if (items.length >= this.batchSize)
                            break;
                    }
                }
                resolve(items);
                return;
            }

            try {
                const { filters, sort } = nameConfig.makeConstraints(nameStart);
                const { items } = await this.fetchAndCachePreviews({
                    filters,
                    sorts: [sort]
                });

                resolve(items);
            }
            catch (error) {
                console.log(error);
                reject('Author fetch by name failed');
            }
        })
        .then(items => items.map(author => ({
            text: author.name,
            value: author.id
        })))
        .catch(error => {
            console.log(error);
            return null;
        })
    }

    updateCachedAuthorInfo(bookIds: string[], authorInfo: BookAuthorInfo | null) {
        const books = this.rootStore.books.getCachedItemsById(bookIds);
        books.forEach(book => book.setAuthorInfo(authorInfo));
        return books;
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