import { action, makeObservable, observable } from "mobx";
import { FirestoreQueryParams, PreviewConstraint, DetailsConstraint } from '../../utils/firestoreDbTypes';
import { FETCH_BATCH_SIZE } from "../../utils/consts";
import Entity, { EntityConstructor, EntityInitInfo, EntityUpdateInfo } from "../../utils/classes/Entity";
import RootStore from "../RootStore";
import DataService from "../../services/DataService";
import PreviewsView from "../previews/PreviewsView";
import DetailsView from "../details/DetailsView";

export default abstract class DataStore<P extends PreviewConstraint, D extends DetailsConstraint> {

    rootStore: RootStore;
    abstract entityName: string;
    abstract EntityConstructor : EntityConstructor<P,D>;
    abstract service : DataService<P,D>;
    abstract previewsView: PreviewsView<P, D>;
    abstract detailsView: DetailsView<P,D>;
    
    batchSize = FETCH_BATCH_SIZE;
    items : Map<string, Entity<P, D>> = new Map();
    isCacheFull = false;

    constructor (rootStore: RootStore) {

        this.rootStore = rootStore;

        makeObservable(this, {
            items: observable,
            isCacheFull: observable,
            fetchAndCachePreviews: action,
            getItemFullInfo: action,
            add: action,
            update: action,
            delete: action.bound,
            setCacheFull: action
        })
    } 

    async fetchAndCachePreviews(params: FirestoreQueryParams<P>) {
        // fetch preview infos, create JS objects and store them
        try {
            const {previews, lastSnap} = await this.service.getPreviews(params);

            const items = this.add(...previews);
            
            return {
                items,
                lastSnap
            }
        }
        catch (error) {
            throw error
        }
    }

    async getItemFullInfo(id: string) {
        const existingItem = this.items.get(id);

        if (existingItem && existingItem.isFullyLoaded) 
            return existingItem;

        try {
            if (!existingItem) {
                const info = await this.service.getFullInfo(id);

                if (info)
                    return this.add({id, ...info})[0];
            }
            // item exists in the store, but only has previewInfo
            else {
                const detailsInfo = await this.service.getDetails(id);

                if (detailsInfo)
                    return this.update({id, detailsInfo})[0];
            }

            // info not found in the DB
            return null;
        }
        catch (error) {
            throw error;
        }
    }

    add(...itemInits: EntityInitInfo<P,D>[]) {

        const items : Entity<P,D>[] = [];

        itemInits.forEach(init => {
            const existingItem = this.items.get(init.id);
            
            // double checking not to rewrite the reference
            if (existingItem) {
                this.update(init);
                items.push(existingItem);
            }

            else {
                const item = new this.EntityConstructor({
                    ...init,
                    store: this
                });
                this.items.set(item.id, item);
                items.push(item);
            }
        })
        
        return items;
    }

    update(...itemInfos: EntityUpdateInfo<P,D>[]) {

        const updItems: Array<Entity<P,D>|null> = [];

        itemInfos.forEach(info => {
            const item = this.items.get(info.id);

            if (item) {
                info.previewInfo && item.setPreview(info.previewInfo);
                info.detailsInfo && item.setDetails(info.detailsInfo);
                updItems.push(item);

            }
            else // item does not exist, update failed
                updItems.push(null);
        })

        return updItems;
    }

    delete(id: string) {
        this.previewsView.defaultView.clearFromCache(id);
        return this.items.delete(id);
    }

    setCacheFull() {
        this.isCacheFull = true;
    }
}