import { action, computed, makeObservable, observable } from "mobx";
import { DetailsConstraint, PreviewConstraint } from "../firestoreDbTypes";
import DataStore from "../../stores/data/DataStore";

export default abstract class Entity<P, D>  {

    id: string;
    previewInfo: PreviewConstraint<P>;
    details: DetailsConstraint<D> | null;
    store: DataStore<P, D, any>;

    constructor ({id, previewInfo, detailsInfo, store}: {
        id: string,
        previewInfo: PreviewConstraint<P>,
        detailsInfo?: DetailsConstraint<D>,
        store: DataStore<P, D, any>
    }) {

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

    setPreview(previewInfo: PreviewConstraint<P>) {
        this.previewInfo = previewInfo;
    }

    setDetails(detailsInfo: DetailsConstraint<D>) {
        this.details = detailsInfo;
    }
}

export type EntityInitInfo<P, D> = {
    id: string,
    previewInfo: PreviewConstraint<P>,
    detailsInfo?: DetailsConstraint<D>,
}

export type EntityUpdateInfo<P, D> = {
    id: string,
    previewInfo?: PreviewConstraint<P>,
    detailsInfo?: DetailsConstraint<D>
}

export type EntityInit<P, D, E extends Entity<P,D>> = EntityInitInfo<P, D> & {
    store: DataStore<P, D, E>
};

export type EntityConstructor<P, D, E extends Entity<P,D>> = new (init: EntityInit<P, D, E>) => E;