import { computed, makeObservable } from "mobx";
import { BookPreviewInfo } from "../firestoreDbTypes";
import Entity, { EntityInit } from "./Entity";

export type BookDetailsInfo = undefined;

export default class Book extends Entity<BookPreviewInfo, BookDetailsInfo> {

    constructor ({id, previewInfo, detailsInfo, store} : EntityInit<BookPreviewInfo, BookDetailsInfo, Book>) {

        super({ id, previewInfo, detailsInfo, store });

        makeObservable(this, {
            authorInfo: computed
        })
    }

    get authorInfo() {
        const {authorId, authorName} = this.previewInfo;
        if (authorId && authorName) 
            return {
                authorId,
                authorName
            }
        return null;
    }
}