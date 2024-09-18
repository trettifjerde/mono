import { action, computed, makeObservable, observable } from "mobx";
import DataStore from "../../stores/data/DataStore";
import { DetailsConstraint, PreviewConstraint } from "../firestoreDbTypes";

export default abstract class Entity<
    P extends PreviewConstraint, 
    D extends DetailsConstraint
>  {

    id: string;
    previewInfo: P;
    details: D | null;
    store: DataStore<P, D>;

    constructor ({id, previewInfo, detailsInfo, store}: EntityInit<P, D>) {

        this.id = id;
        this.previewInfo = previewInfo;
        this.details = detailsInfo || null;
        this.store = store;

        makeObservable(this, {
            previewInfo: observable,
            details: observable,
            preview: computed,
            description: computed,
            fullInfo: computed,
            isFullyLoaded: computed,
            setPreview: action,
            setDetails: action,
        });
    }

    get preview() {
        return {
            id: this.id,
            ...this.previewInfo
        };
    }

    get isFullyLoaded() {
        return !!this.details;
    }

    get description() {
        return this.details?.description || '';
    }

    get fullInfo() {
        return this.details ? {
            id: this.id,
            ...this.previewInfo,
            ...this.details
        } : null;
    }

    setPreview(previewInfo: P) {
        this.previewInfo = previewInfo;
    }

    setDetails(detailsInfo: D) {
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

export type EntityConstructor<P extends PreviewConstraint, D extends DetailsConstraint> = new (init: EntityInit<P,D>) => Entity<P,D>;