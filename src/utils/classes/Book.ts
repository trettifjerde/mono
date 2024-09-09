import Entity, { DetailsConstraint, EntityInit } from "./Entity";
import { FirebaseDB, FirebaseKeys } from "../dbTypes";

export default class Book extends Entity<BookPreviewInfo, BookDetailsInfo> {

    constructor ({id, previewInfo, detailsInfo, isInGrid, store} : EntityInit<BookPreviewInfo, BookDetailsInfo>) {

        super({ id, previewInfo, detailsInfo, isInGrid, store });
    }
}

export type BookPreviewInfo = FirebaseDB[FirebaseKeys.books][""];
export type BookDetailsInfo = DetailsConstraint;