import { doc, Transaction } from "firebase/firestore/lite";
import { FirestoreKeys as FK } from "../utils/firestoreDbTypes";
import { AuthorFormShape } from "../stores/FormView/forms/AuthorForm";
import Author from "../utils/classes/Author";
import DataService from "./DataService";
import AuthorStore from "../stores/DataStore/AuthorStore";

export default class AuthorService extends DataService<Author> {

    constructor(store: AuthorStore) {
        super(store, FK.authors, FK.bios);
    }

    override async fetchDetails(id: string) {
        return Promise.all([
            this.fetchDescription(id),
            this.store.rootStore.books.getBooksByAuthorId(id)
        ])
            .then(([description, books]) => ({
                description,
                books
            }))
    }

    override async postItem(formData: AuthorFormShape) {
        try {
            const { previewInfo, description, bookIds } = Author.formDataToFirestore(formData);
            const { batch, previewDoc } = this.writePostBatch({ previewInfo, description });
            const booksRef = this.store.rootStore.books.service.previewsRef;

            bookIds.forEach(bookId => {
                batch.update(doc(booksRef, bookId), {
                    [FK.authorName]: previewInfo[FK.name],
                    [FK.authorId]: previewDoc.id
                })
            })

            await batch.commit();

            return {
                id: previewDoc.id,
                previewInfo,
                description,
                bookIds
            };
        }
        catch (error) {
            throw error;
        }
    }

    override async updateItem(initial: Author, formData: AuthorFormShape) {

        const { previewInfo, description, bookIds } = Author.formDataToFirestore(formData);
        const bookChangeLog = this.makeBookChangeLog(initial.books.map(b => b.id), bookIds);

        const extraActions = (transaction: Transaction) => {
            const booksRef = this.store.rootStore.books.service.previewsRef;

            // if author name has changed, we need to update author book previews
            if (previewInfo[FK.name] !== initial.name) {
                bookChangeLog.kept.forEach(bookId => transaction
                    .update(doc(booksRef, bookId), {
                        [FK.authorName]: previewInfo[FK.name]
                    })
                );
            }
            bookChangeLog.removed.forEach(bookId => transaction
                .update(doc(booksRef, bookId), {
                    [FK.authorId]: null,
                    [FK.authorName]: null
                })
            );
            bookChangeLog.added.forEach(bookId => transaction
                .update(doc(booksRef, bookId), {
                    [FK.authorId]: initial.id,
                    [FK.authorName]: previewInfo[FK.name]
                })
            );

            return Promise.resolve();
        }

        const changeLog = await this.runItemUpdate({
            initial, previewInfo, description,
            extraActions
        })

        return {
            ...changeLog,
            bookChangeLog
        };
    }

    private makeBookChangeLog(initialIds: string[], newIds: string[]) {
        const oldIdSet = new Set(initialIds);
        const newIdSet = new Set(newIds);

        const removed: string[] = [];
        const kept: string[] = [];

        initialIds.forEach(id => {
            if (newIdSet.has(id))
                kept.push(id)
            else
                removed.push(id)
        });
        const added = newIds.filter(id => !oldIdSet.has(id));

        return { removed, kept, added };
    }
}