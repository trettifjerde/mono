import { action, computed, makeObservable } from "mobx";
import { AuthorPreviewInfo, FirestoreAuthor, FirestoreKeys } from "../firestoreDbTypes";
import { AuthorFormShape } from "../../stores/FormView/forms/AuthorForm";
import Entity, { EntityInitInfo } from "./Entity";
import Book from "./Book";

export type AuthorDetailsInfo = {
    books: Book[]
}

export default class Author extends Entity<AuthorPreviewInfo, AuthorDetailsInfo> {

    constructor ({id, previewInfo, detailsInfo} : EntityInitInfo<Author>) {
        super({id, previewInfo, detailsInfo});

        makeObservable(this, {
            books: computed,
            addBook: action,
            removeBook: action
        })
    }

    get books() {
        return this.detailsInfo?.books || [];
    }   

    addBook(book: Book) {
        this.previewInfo[FirestoreKeys.bookN] += 1;
        this.detailsInfo?.books.push(book);
    }

    removeBook(bookId: string) {
        this.previewInfo[FirestoreKeys.bookN] -= 1;
        if (this.detailsInfo)
            this.detailsInfo.books = this.detailsInfo.books.filter(b => b.id !== bookId);
    }

    static formDataToFirestore(formData: AuthorFormShape) {
        const {name, bookIds, bio, img} = formData;

        const previewInfo : FirestoreAuthor = {
            [FirestoreKeys.name]: name,
            [FirestoreKeys.name_lowercase]: name.toLowerCase(),
            [FirestoreKeys.bookN]: bookIds.length,
        };

        if (img)
            previewInfo[FirestoreKeys.img] = img;

        const description = bio;

        return {previewInfo, description, bookIds}
    }
}