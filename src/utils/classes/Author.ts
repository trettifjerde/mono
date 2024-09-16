import { computed, makeObservable } from "mobx";
import { AuthorDetailsInfo, AuthorPreviewInfo } from "../../services/AuthorService";
import Entity, { EntityInit } from "./Entity";

export default class Author extends Entity<AuthorPreviewInfo, AuthorDetailsInfo> {

    constructor ({id, previewInfo, detailsInfo, store} : EntityInit<AuthorPreviewInfo, AuthorDetailsInfo>) {
        super({id, previewInfo, detailsInfo, store});

        makeObservable(this, {
            books: computed
        })
    }

    get books() {
        return this.details?.books || [];
    }

    
}