import EntityStore from "../../stores/EntityStore";

export type PreviewConstraint = {name: string, img?: string};
export type DetailsConstraint = {description: string};

export default abstract class Entity<
    PreviewInfo extends PreviewConstraint, 
    DetailsInfo extends DetailsConstraint
> {

    id: string;
    protected previewInfo: PreviewInfo;
    protected detailsInfo: DetailsInfo | null;
    isInGrid: boolean;
    store: EntityStore<PreviewInfo, DetailsInfo>;

    constructor ({id, previewInfo, detailsInfo, isInGrid, store}: EntityInit<PreviewInfo, DetailsInfo>) {

        this.id = id;
        this.previewInfo = previewInfo;
        this.detailsInfo = detailsInfo || null;
        this.isInGrid = isInGrid;
        this.store = store;
    }

    get preview() {
        return  {
            id: this.id,
            ...this.previewInfo 
        };
    }

    get details() {
        return this.detailsInfo ? {
            id: this.id, 
            ...this.detailsInfo
        } : null;
    }

    setPreview(previewInfo: PreviewInfo) {
        this.previewInfo = previewInfo;
    }

    setDetails(detailsInfo: DetailsInfo) {
        this.detailsInfo = detailsInfo;
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
    isInGrid: boolean,
    store: EntityStore<P, D>
};

export type EntityConstructor<
    P extends PreviewConstraint, 
    D extends DetailsConstraint
> = new (init: EntityInit<P,D>) => Entity<P,D>;