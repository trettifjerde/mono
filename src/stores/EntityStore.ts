import { action, makeObservable, observable } from "mobx";
import StoreSlice from "./slices/StoreSlice";
import Entity, { EntityInitInfo, EntityUpdateInfo, PreviewConstraint as PC, DetailsConstraint as DC  } from "../utils/classes/Entity";

export default class EntityStore<P extends PC, D extends DC> {

    slice: StoreSlice<P, D>;

    items : Map<string, Entity<P, D>> = new Map();

    constructor (slice: StoreSlice<P, D>) {

        this.slice = slice;

        makeObservable(this, {
            items: observable,
            add: action,
            update: action
        })
    } 

    add(isInGrid: boolean, ...itemInits: EntityInitInfo<P,D>[]) {

        const items = itemInits.map(init => new this.slice.EntityConstructor({
            ...init,
            isInGrid,
            store: this
        }));

        items.forEach(item => this.items.set(item.id, item));

        return items;
    }

    // TODO: will be buggy behaviour because Entity properties are not observables. will fix later
    update(isInGrid: boolean, ...itemInfos: EntityUpdateInfo<P,D>[]) {

        const updItems: Array<Entity<P,D>|null> = [];

        itemInfos.forEach(info => {
            const item = this.items.get(info.id);

            if (item) {
                info.previewInfo && item.setPreview(info.previewInfo);
                info.detailsInfo && item.setDetails(info.detailsInfo);
                item.isInGrid = item.isInGrid || isInGrid;
                updItems.push(item)
            }
            else
                updItems.push(null);
        })

        return updItems;
    }
}