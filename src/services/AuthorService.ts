import { deleteField, doc, UpdateData, writeBatch } from "firebase/firestore/lite";
import { FirestoreAuthor, FirestoreKeys as FK } from "../utils/firestoreDbTypes";
import { AuthorFormShape } from "../stores/FormView/forms/AuthorForm";
import { compareBookIds } from "../utils/helpers";
import Author from "../utils/classes/Author";
import DataService from "./DataService";
import AuthorStore from "../stores/DataStore/AuthorStore";
import db from "./Firestore";

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

    async postAuthor(formData: AuthorFormShape) {

        const {previewInfo, description, bookIds} = Author.formDataToFirestore(formData);

        const batch = writeBatch(db);
        const previewDoc = doc(this.previewsRef)

        batch.set(previewDoc, previewInfo);

        if (description)
            batch.set(doc(this.descriptionsRef), description);

        const booksRef = this.store.rootStore.books.service.previewsRef;

        bookIds.forEach(bookId => {
            batch.update(doc(booksRef, bookId), {
                [FK.authorName]: previewInfo[FK.name],
                [FK.authorId]: previewDoc.id
            })
        })

        try {
            return batch.commit()
                .then(() => ({
                    id: previewDoc.id, 
                    previewInfo, 
                    description, 
                    bookIds
                }));
        }
        catch (error) {
            throw error;
        }
    }

    async updateAuthor(initial: Author, formData: AuthorFormShape) {

        const batch = writeBatch(db);
        const {previewInfo, description, bookIds} = Author.formDataToFirestore(formData);
        const changeLog : AuthorChangeLog = compareBookIds(initial.books.map(b => b.id), bookIds);

        const previewUpdateData = Object.entries(previewInfo).reduce((acc, [k, newValue]) => {
            const key = k as keyof FirestoreAuthor;

            if (newValue !== initial.previewInfo[key]) 
                acc[key] = newValue === undefined ? deleteField() : newValue as any;
            return acc;

        }, {} as UpdateData<FirestoreAuthor>)

        if (Object.keys(previewUpdateData).length) {
            changeLog.previewInfo = previewInfo;
            batch.update(doc(this.previewsRef, initial.id), previewUpdateData)
        }

        const booksRef = this.store.rootStore.books.service.previewsRef;

        previewUpdateData[FK.name] && changeLog.booksKept.forEach(bookId => batch.update(
            doc(booksRef, bookId), {
                [FK.authorName]: previewInfo[FK.name]
            }
        ));

        changeLog.booksRemoved.forEach(bookId => batch.update(
            doc(booksRef, bookId), {
                [FK.authorId]: null,
                [FK.authorName]: null
            }
        ));

        changeLog.booksAdded.forEach(bookId => batch.update(
            doc(booksRef, bookId), {
                [FK.authorId]: initial.id,
                [FK.authorName]: previewInfo[FK.name]
            }
        ));

        if (description !== initial.description) {
            changeLog.description = description;
            const descRef = doc(this.descriptionsRef, initial.id);

            if (description)
                batch.set(descRef, description);
            else 
                batch.delete(descRef);
        }

        await batch.commit();

        return changeLog;
    }
}

type AuthorChangeLog = {
    previewInfo?: Author['previewInfo']
    description?: string,
    booksRemoved: string[],
    booksKept: string[],
    booksAdded: string[]
}