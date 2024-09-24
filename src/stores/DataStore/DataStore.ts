import { action, makeObservable, observable } from "mobx";
import { FETCH_BATCH_SIZE } from "../../utils/consts";
import { FilterConfig, FirestoreQueryParams, SortConfig } from "../../utils/dataTypes";
import Entity, { EntityInitInfo, EntityUpdateInfo } from "../../utils/classes/Entity";
import RootStore from "../RootStore";
import DataService from "../../services/DataService";
import PreviewsView from "../PreviewsView/PreviewsView";
import DetailsView from "../DetailsView/DetailsView";
import FormView from "../FormView/FormView";

export default abstract class DataStore<E extends Entity=any> {

    batchSize = FETCH_BATCH_SIZE;

    abstract EntityConstructor : new (init: EntityInitInfo<E>) => E;
    abstract entityName: string;
    abstract pathname: string;
    abstract sortConfig: SortConfig<any, E>;
    abstract filterConfig: FilterConfig<any, E>;
    
    rootStore: RootStore;
    abstract service : DataService<E>;
    abstract previewsView: PreviewsView<E>;
    abstract detailsView: DetailsView<E>;
    abstract formView: FormView<E>;
    
    items : Map<string, E> = new Map();
    isCacheFull = false;

    constructor (rootStore: RootStore) {

        this.rootStore = rootStore;

        makeObservable(this, {
            items: observable,
            isCacheFull: observable,
            addToCache: action,
            updateCache: action,
            deleteFromCache: action.bound,
            setCacheFull: action
        })
    } 

    addToCache(...itemInits: EntityInitInfo<E>[]) {

        const items : E[] = [];

        itemInits.forEach(init => {
            const existingItem = this.items.get(init.id);
            
            // double checking not to rewrite the reference
            if (existingItem) {
                this.updateCache(init);
                items.push(existingItem);
            }

            else {
                const item = new this.EntityConstructor({...init});
                this.items.set(item.id, item);
                items.push(item);
            }
        })
        
        return items;
    }

    updateCache(...itemInfos: EntityUpdateInfo<E>[]) {

        return itemInfos.map(info => {

            const item = this.items.get(info.id);

            if (item) {
                info.previewInfo && item.setPreview(info.previewInfo);
                info.detailsInfo && item.setDetails(info.detailsInfo);
                return item;
            }
            else // item does not exist, update failed
                return null;
        })
    }

    deleteFromCache(id: string) {
        this.previewsView.defaultView.clearItemFromCache(id);
        return this.items.delete(id);
    }

    setCacheFull() {
        this.isCacheFull = true;
    }

    async fetchAndCachePreviews(params: FirestoreQueryParams<E>) {
        try {
            const {previews, lastSnap} = await this.service.fetchPreviews(params);
                        
            return {
                items: this.addToCache(...previews),
                lastSnap
            }
        }
        catch (error) {
            throw error;
        }
    }
    /*
        depending on the cache state, either retrieves item from cache 
        or fetches it from DB - fully or just its missing parts
    */
    async getItem(id: string) {
        const existingItem = this.items.get(id);

        if (existingItem && existingItem.hasFullInfo)
            return existingItem;

        try {
            if (!existingItem) {
                const init = await this.service.fetchFullItemInfo(id);

                // request is successful, but item with such id is not found in the database
                if (!init)
                    return null;

                return this.addToCache({id, ...init})[0];
            }
            else {
                const detailsInfo = await this.service.fetchDetails(id);
                
                return this.updateCache({id, detailsInfo})[0];
            }
        }
        catch (error) {
            throw error;
        }
    }

    abstract postItem(formData: any) : Promise<string>;
    abstract updateItem(initialItem: E, formData: any) : Promise<string>;
    abstract deleteItem(id: string) : Promise<void>;

    getCachedItemsById(ids: string[]) {
        return ids
            .map(id => this.items.get(id) || null)
            .filter(item => !!item);
    }

    filterFromCache(filterFn: (i: E) => boolean, all=true) {
        const items: E[] = [];

        for (const item of this.items.values()) {
            if (filterFn(item))
                items.push(item)
        }
        return all ? items : items.slice(0, this.batchSize);
    }
}