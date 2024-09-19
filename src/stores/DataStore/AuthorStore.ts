import { AuthorPreviewInfo, FirestoreKeys, PreviewConstraint } from "../../utils/firestoreDbTypes";
import { makeNameFilter } from "../../utils/helpers";
import Author, { AuthorDetailsInfo } from "../../utils/classes/Author";
import RootStore from "../RootStore";
import DataStore from "./DataStore";
import AuthorService from "../../services/AuthorService";
import AuthorPreviewsView from "../PreviewsView/AuthorPreviewsView";
import AuthorDetailsView from "../DetailsView/AuthorDetailsView";
import AuthorFormView from "../FormView/AuthorFormView";

export default class AuthorStore extends DataStore<AuthorPreviewInfo, AuthorDetailsInfo, Author> {
    override entityName = "Author";
    override EntityConstructor = Author;
    override service : AuthorService;
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

    async postAuthor(info: {
        previewInfo: PreviewConstraint<AuthorPreviewInfo>, 
        description: string | undefined,
        bookIds: string[]
    }) {
        try {
            const id : string = await this.service.postAuthor(info);

            const {previewInfo, description, bookIds} = info;
            const books = this.rootStore.books
                .updateAuthorInfo(bookIds, {
                    authorName: previewInfo.name,
                    authorId: id
                })
                .filter(book => !!book);

            this.add({id, previewInfo, detailsInfo: {
                description: description || '',
                books
            }})[0];

            return id;

        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    async getAuthorsByName(nameStart: string) {
        if (this.isCacheFull)
            return {
                items: Array.from(this.items.values())
                    .filter(author => author
                        .previewInfo[FirestoreKeys.name_lowercase]
                        .startsWith(nameStart)
                    )
                    .slice(0, this.batchSize),
                fromCache: true
            }

        else {
            const info = await this.fetchAndCachePreviews({
                filters: makeNameFilter<AuthorPreviewInfo>(nameStart),
                sorts: [{field: FirestoreKeys.name_lowercase}],
            });

            if (info)
                return {
                    items: info.items,
                    fromCache: false
                }

            return null;
        }
    }
}