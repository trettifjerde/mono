import { action, computed, makeObservable, observable } from "mobx";
import { DetailsConstraint, FirestoreKeys, PreviewConstraint } from "../firestoreDbTypes";

export default abstract class Entity<P=any, D=any>  {

    id: string;
    previewInfo: PreviewConstraint<P>;
    detailsInfo: DetailsConstraint<D> | null;

    constructor ({id, previewInfo, detailsInfo}: EntityInitInfo<Entity<P,D>>) {

        this.id = id;
        this.previewInfo = previewInfo;
        this.detailsInfo = detailsInfo || null;

        makeObservable(this, {
            previewInfo: observable,
            detailsInfo: observable,
            preview: computed,
            name: computed,
            img: computed,
            description: computed,
            hasFullInfo: computed, 
            setPreview: action,
            setDetails: action
        });
    }

    get preview() {
        return {
            id: this.id,
            ...this.previewInfo
        };
    }

    get name() {
        return this.previewInfo[FirestoreKeys.name];
    }

    get img() {
        return this.previewInfo[FirestoreKeys.img] || '';
    }

    get description() {
        return this.detailsInfo?.description || '';
    }

    get hasFullInfo() {
        return !!this.detailsInfo;
    }

    setPreview(previewInfo: PreviewConstraint<P>) {
        this.previewInfo = previewInfo;
    }

    setDetails(detailsInfo: DetailsConstraint<D>) {
        this.detailsInfo = detailsInfo;
    }
}

export type EntityInitInfo<E extends Entity> = {
    id: string,
    previewInfo: E['previewInfo'],
    detailsInfo?: E['detailsInfo']
}

export type EntityUpdateInfo<E extends Entity> = {
    id: string,
    previewInfo?: E['previewInfo'],
    detailsInfo?: E['detailsInfo']
}