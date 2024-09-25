import { action, computed, makeObservable } from "mobx";
import { BookPreviewInfo, FirestoreBook, FirestoreKeys as FK } from "../firestoreDbTypes";
import { BookFormFields as BFF, BookFormShape } from "../../stores/FormView/forms/BookForm";
import Entity, { EntityInitInfo } from "./Entity";

export type BookDetailsInfo = undefined;
export type BookAuthorInfo = {name: string, id: string};

export default class Book extends Entity<BookPreviewInfo, BookDetailsInfo> {

    constructor ({id, previewInfo, detailsInfo} : EntityInitInfo<Book>) {

        super({ id, previewInfo, detailsInfo });

        makeObservable(this, {
            inStock: computed,
            authorInfo: computed,
            setAuthorInfo: action
        })
    }

    get inStock() {
        return this.previewInfo[FK.inStock];
    }

    get authorInfo() {
        const {authorId, authorName} = this.previewInfo;
        return (authorId && authorName) ? {
            id: authorId,
            name: authorName
        } as BookAuthorInfo : null;
    }

    setAuthorInfo(info: BookAuthorInfo | null) {
        this.previewInfo[FK.authorId] = info?.id || null;
        this.previewInfo[FK.authorName] = info?.name || null;
    }

    static formDataToFirestore(formData: BookFormShape) {

        const previewInfo : FirestoreBook = {
            [FK.name]: formData[BFF.title],
            [FK.name_lowercase]: formData[BFF.title].toLowerCase(),
            [FK.img]: formData[BFF.img],
            [FK.authorName]: formData[BFF.author]?.name || null,
            [FK.authorId]: formData[BFF.author]?.id || null,
            [FK.price]: parseFloat(formData[BFF.price].toFixed(2)),
            [FK.inStock]: formData[BFF.inStock],
        };

        return {
            previewInfo,
            description: formData[BFF.description]
        }
    }
}