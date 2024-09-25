import { doc, Transaction } from "firebase/firestore/lite";
import { FirestoreKeys as FK } from "../utils/firestoreDbTypes";
import { BookFormShape } from "../stores/FormView/forms/BookForm";
import BookStore from "../stores/DataStore/BookStore";
import DataService from "./DataService";
import Book from "../utils/classes/Book";
import Author from "../utils/classes/Author";

export default class BookService extends DataService<Book> {

    constructor(store: BookStore) {
        super(store, FK.books, FK.descriptions);
    }

    override async fetchDetails(id: string) {
        return this.fetchDescription(id)
            .then(description => ({ description }))
    }

    override async postItem(formData: BookFormShape) {
        try {
            const { previewInfo, description } = Book.formDataToFirestore(formData);
            const { batch, id } = this.writePostBatch({ previewInfo, description });

            let author: Author | null = null;

            if (previewInfo.authorId) {
                // author will be cached after user has selected them on the form page
                const authorStore = this.store.rootStore.authors;
                author = authorStore.items.get(previewInfo.authorId)!;

                batch.update(doc(authorStore.service.previewsRef, previewInfo.authorId), {
                    [FK.bookN]: author.previewInfo[FK.bookN] + 1
                })
            }

            await batch.commit();

            return {
                id,
                previewInfo,
                description,
                author
            };
        }
        catch (error) {
            throw error;
        }
    }

    override async updateItem(initial: Book, formData: BookFormShape) {

        try {
            const { previewInfo, description } = Book.formDataToFirestore(formData);
            const {authorLog, extraActions} = this.makeAuthorUpdateActions(previewInfo, initial);
            const changeLog = await this.runItemUpdate({ initial, previewInfo, description, extraActions })

            return { ...changeLog, authorLog };
        }
        catch (error) {
            throw error;
        }
    }

    override async deleteItem(item: Book) {
        try {
            const extraActions = async(t: Transaction) => {
                if (item.authorInfo) {
                    const authorDoc = doc(this.store.rootStore.authors.service.previewsRef, item.authorInfo.id);
                    const author = await t.get(authorDoc);
                    if (author.exists()) {
                        t.update(authorDoc, {
                            [FK.bookN]: author.data()[FK.bookN] - 1
                        })
                    }
                }
            }
            await this.runItemDelete({item, extraActions});
            return;
        }
        catch (error) {
            throw error;
        }
    }

    private makeAuthorUpdateActions(previewInto: Book['previewInfo'], initial: Book) : {
        authorLog: AuthorChangeLog,
        extraActions?: (t: Transaction) => Promise<void>
    } {

        const curAuthorId = previewInto[FK.authorId];
        const prevAuthorId = initial.authorInfo && initial.authorInfo.id;

        if (curAuthorId === prevAuthorId)
            return {authorLog: {}};

        const authorStore = this.store.rootStore.authors;
        const authorPreviewsRef = authorStore.service.previewsRef;

        const authorLog : AuthorChangeLog = {};
        const transactionChain: Array<(t: Transaction) => Promise<Transaction>> = [];

        // if author was changed, we need to decrease the bookN of the prev author
        // previous author might be missing in the cache, so we have to read the value first
        if (prevAuthorId) {
            transactionChain.push(async (t: Transaction) => {
                const prevAuthor = await t.get(doc(authorPreviewsRef, prevAuthorId));

                if (prevAuthor.exists())
                    t.update(doc(authorPreviewsRef, prevAuthorId), {
                        [FK.bookN]: prevAuthor.data()[FK.bookN] - 1
                    });

                return t;
            });
            authorLog.removedId = prevAuthorId;
        }

        // new author has been added through the form
        // so we can be sure the author info is cached
        if (curAuthorId) {
            const curAuthor = authorStore.items.get(curAuthorId)!;

            transactionChain.push(async(t: Transaction) => t.update(
                doc(authorPreviewsRef, curAuthorId), {
                    [FK.bookN]: curAuthor.previewInfo[FK.bookN] + 1
                }
            ));
            authorLog.addedId = curAuthorId;
        }

        return {
            authorLog,
            extraActions: async(t: Transaction) => {
                for (const link of transactionChain) 
                    await link(t);
                return;
            }
        }
    }
}

type AuthorChangeLog = {
    addedId?: string,
    removedId?: string
}