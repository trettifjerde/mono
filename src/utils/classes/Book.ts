import { DetailsConstraint, FirestoreBook } from "../firestoreDbTypes";
import Entity, { EntityInit } from "./Entity";

export default class Book extends Entity<FirestoreBook, DetailsConstraint> {

    constructor ({id, previewInfo, detailsInfo, store} : EntityInit<FirestoreBook, DetailsConstraint>) {

        super({ id, previewInfo, detailsInfo, store });
    }
}