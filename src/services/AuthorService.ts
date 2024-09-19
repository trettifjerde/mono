import { collection, CollectionReference, doc, writeBatch } from "firebase/firestore/lite";
import { AuthorPreviewInfo, FirestoreAuthor, FirestoreKeys as FK, PreviewConstraint } from "../utils/firestoreDbTypes";
import { AuthorDetailsInfo } from "../utils/classes/Author";
import DataService from "./DataService";
import AuthorStore from "../stores/DataStore/AuthorStore";
import db from "./Firestore";

export default class AuthorService extends DataService<AuthorPreviewInfo, AuthorDetailsInfo> {

    override previewsRef: CollectionReference<PreviewConstraint<AuthorPreviewInfo>>;

    constructor(store: AuthorStore) {
        super(store, FK.bios);
        
        this.previewsRef = collection(db, FK.authors)
            .withConverter(DataService.makePreviewsConverter<FirestoreAuthor>())
    }

    override getDetails(id: string, clipBooks=true) {
        return Promise.all([
            this.getDescription(id),
            this.store.rootStore.books.getAuthorBooks(id, clipBooks)
        ])
        .then(([description, books]) => {
            if (!books)
                return null;

            return {
                description,
                books
            }
        })
    }

    async postAuthor({previewInfo, description, bookIds}: {
        previewInfo: PreviewConstraint<AuthorPreviewInfo>, 
        description: string | undefined,
        bookIds: string[]
    }) {
        const batch = writeBatch(db);

        const previewDoc = doc(this.previewsRef)
        const descRef = doc(this.descriptionsRef);

        batch.set(previewDoc, previewInfo);
        batch.set(descRef, description);

        for (const bookId of bookIds) {
            const bookRef = doc(this.store.rootStore.books.service.previewsRef, bookId)
            batch.update(bookRef, {
                [FK.authorName]: previewInfo[FK.name],
                [FK.authorId]: previewDoc.id
            })
        }

        await batch.commit();

        return previewDoc.id;
    }
}