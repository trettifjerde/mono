import { computed, makeObservable } from "mobx";
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
            books: computed
        })
    }

    get books() {
        return this.detailsInfo?.books || [];
    }   

    static formDataToFirestore(formData: AuthorFormShape) {
        const {name, bookIds, bio, img} = formData;

        const previewInfo : FirestoreAuthor = {
            [FirestoreKeys.name]: name,
            [FirestoreKeys.name_lowercase]: name.toLowerCase(),
            [FirestoreKeys.bookN]: bookIds.length,
            [FirestoreKeys.img]: img || undefined
        };
        const description = bio;

        return {previewInfo, description, bookIds}
    }
}