import { action, computed, makeObservable, observable } from "mobx";
import DataStore from "../../stores/DataStore";
import { DetailsConstraint, FirestoreKeys, PreviewConstraint } from "../firestoreDbTypes";

export default abstract class Entity<
    PreviewInfo extends PreviewConstraint, 
    DetailsInfo extends DetailsConstraint
> {

    id: string;
    previewInfo: PreviewInfo;
    details: DetailsInfo | null;
    store: DataStore<PreviewInfo, DetailsInfo>;

    constructor ({id, previewInfo, detailsInfo, store}: EntityInit<PreviewInfo, DetailsInfo>) {

        this.id = id;
        this.previewInfo = previewInfo;
        this.details = detailsInfo || null;
        this.store = store;

        makeObservable(this, {
            previewInfo: observable,
            details: observable,
            nameLC: computed,
            preview: computed,
            fullInfo: computed,
            setPreview: action,
            setDetails: action,
        });
    }

    get nameLC() {
        return this.previewInfo[FirestoreKeys.name_lowercase];
    }

    get preview() {
        return  {
            id: this.id,
            ...this.previewInfo 
        };
    }

    get fullInfo() {
        return this.details? {
            id: this.id, 
            ...this.previewInfo, 
            ...this.details,
            itemTypeName: this.constructor.name
        } : null;
    }

    setPreview(previewInfo: PreviewInfo) {
        this.previewInfo = previewInfo;
    }

    setDetails(detailsInfo: DetailsInfo) {
        this.details = detailsInfo;
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
    store: DataStore<P, D>
};

export type EntityConstructor<
    P extends PreviewConstraint, 
    D extends DetailsConstraint
> = new (init: EntityInit<P,D>) => Entity<P,D>;