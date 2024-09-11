import Entity, { DetailsConstraint, EntityInit } from "./Entity";
import { FirebaseDB, FirebaseKeys } from "../dbTypes";

export default class Book extends Entity<BookPreviewInfo, BookDetailsInfo> {

    constructor ({id, previewInfo, detailsInfo, store} : EntityInit<BookPreviewInfo, BookDetailsInfo>) {

        super({ id, previewInfo, detailsInfo, store });
    }
}

export type BookPreviewInfo = FirebaseDB[FirebaseKeys.books][""];
export type BookDetailsInfo = DetailsConstraint;