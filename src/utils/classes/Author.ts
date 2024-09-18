import { computed, makeObservable } from "mobx";
import { AuthorPreviewInfo } from "../firestoreDbTypes";
import Entity, { EntityInit } from "./Entity";
import Book from "./Book";

export type AuthorDetailsInfo = {books: Book[]}

export default class Author extends Entity<AuthorPreviewInfo, AuthorDetailsInfo> {

    constructor ({id, previewInfo, detailsInfo, store} : EntityInit<AuthorPreviewInfo, AuthorDetailsInfo, Author>) {
        super({id, previewInfo, detailsInfo, store});

        makeObservable(this, {
            books: computed
        })
    }

    get books() {
        return this.details?.books || [];
    }   
}