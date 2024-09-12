import { AuthorDetails, AuthorPreview } from "../../services/AuthorService";
import Entity, { EntityInit } from "./Entity";

export default class Author extends Entity<AuthorPreview, AuthorDetails> {

    constructor ({id, previewInfo, detailsInfo, store} : EntityInit<AuthorPreview, AuthorDetails>) {
        
        super({id, previewInfo, detailsInfo, store});
    }
}