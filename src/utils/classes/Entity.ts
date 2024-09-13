import EntityStore from "../../stores/EntityStore";
import { DetailsConstraint, FirestoreKeys, PreviewConstraint } from "../firestoreDbTypes";

export default abstract class Entity<
    PreviewInfo extends PreviewConstraint, 
    DetailsInfo extends DetailsConstraint
> {

    id: string;
    protected previewInfo: PreviewInfo;
    protected detailsInfo: DetailsInfo | null;
    store: EntityStore<PreviewInfo, DetailsInfo>;

    constructor ({id, previewInfo, detailsInfo, store}: EntityInit<PreviewInfo, DetailsInfo>) {

        this.id = id;
        this.previewInfo = previewInfo;
        this.detailsInfo = detailsInfo || null;
        this.store = store;
    }

    get preview() {
        return  {
            id: this.id,
            ...this.previewInfo 
        };
    }

    get details() {
        return this.detailsInfo ? this.detailsInfo : null;
    }

    setPreview(previewInfo: PreviewInfo) {
        this.previewInfo = previewInfo;
    }

    setDetails(detailsInfo: DetailsInfo) {
        this.detailsInfo = detailsInfo;
    }

    nameStartsWith(str: string) {
        return this.previewInfo[FirestoreKeys.name_lowercase].startsWith(str);
    }

    get fullInfo() {
        return this.detailsInfo ? {
            id: this.id, 
            ...this.previewInfo, 
            ...this.detailsInfo,
            itemTypeName: this.constructor.name
        } : null;
    }
}

export type EntityInitInfo<P extends PreviewConstraint, D extends DetailsConstraint> = {
    id: string,
    previewInfo: P,
    detailsInfo?: D,
}

export type EntityUpdateInfo<P extends PreviewConstraint, D extends DetailsConstraint> = {
    id: string,
    previewInfo?: P,
    detailsInfo?: D
}

export type EntityInit<P extends PreviewConstraint, D extends DetailsConstraint> = EntityInitInfo<P,D> & {
    store: EntityStore<P, D>
};

export type EntityConstructor<
    P extends PreviewConstraint, 
    D extends DetailsConstraint
> = new (init: EntityInit<P,D>) => Entity<P,D>;