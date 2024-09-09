import { FirebaseDB, FirebaseKeys } from "../dbTypes";
import Book from "./Book";
import Entity, { DetailsConstraint, EntityInit } from "./Entity";

export default class Author extends Entity<AuthorPreviewInfo, AuthorDetailsInfo> {

    constructor ({id, previewInfo, detailsInfo, isInGrid, store} : EntityInit<AuthorPreviewInfo, AuthorDetailsInfo>) {
        
        super({id, previewInfo, detailsInfo, isInGrid, store});
    }
}

export type AuthorPreviewInfo = FirebaseDB[FirebaseKeys.authors][""];
export type AuthorDetailsInfo = DetailsConstraint & {
    books: Book['preview'][]
};