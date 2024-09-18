import { BookDetailsInfo, BookPreviewInfo } from "../../services/BookService";
import Entity, { EntityInit } from "./Entity";

export default class Book extends Entity<BookPreviewInfo, BookDetailsInfo> {

    constructor ({id, previewInfo, detailsInfo, store} : EntityInit<BookPreviewInfo, BookDetailsInfo>) {

        super({ id, previewInfo, detailsInfo, store });
    }
}