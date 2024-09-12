import { action, computed, makeObservable, observable } from "mobx";
import StoreSlice from "./slices/StoreSlice";
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../utils/firestoreDbTypes';
import { LoadingState } from "../utils/consts";
import Entity from "../utils/classes/Entity";

export default class DetailsStore<P extends PC, D extends DC> {
    slice: StoreSlice<P, D>;

    state: LoadingState = LoadingState.idle;
    selectedId = '';
    loadedItem: Entity<P, D> | null = null;

    constructor(slice: StoreSlice<P, D>) {
        this.slice = slice;

        makeObservable(this, {
            state: observable,
            selectedId: observable,
            loadedItem: observable,
            isFailure: computed,
            isLoading: computed,
            setLoadedItem: action,
            setLoading: action,
            setFailure: action
        })
    }

    get isFailure() {
        return this.state === LoadingState.error || this.state === LoadingState.notFound;
    }
    get isLoading() {
        return this.state === LoadingState.loading;
    }

    setLoadedItem(item: Entity<P,D>) {
        this.selectedId = item.id;
        this.loadedItem = item;
        this.state = LoadingState.idle;
    }

    setLoading(id: string) {
        this.selectedId = id;
        this.loadedItem = null;
        this.state = LoadingState.loading;
    }

    setFailure(state: LoadingState.notFound | LoadingState.error) {
        this.loadedItem = null;
        this.state = state;
    }

    async prepareItem(id: string) {
        
        const existingItem = this.slice.store.items.get(id);
        
        if (existingItem && existingItem.details) {
            this.setLoadedItem(existingItem);
            return;
        }

        this.setLoading(id);

        try {
            const fetchInfoFn = !existingItem ? this.fetchFullInfo : this.fetchDetails;

            const saveFetchedInfo = await fetchInfoFn.call(this, id);
            if (saveFetchedInfo)
                saveFetchedInfo();
            else
                this.setFailure(LoadingState.notFound);
        }
        catch (error) {
            this.setFailure(LoadingState.error);
        }
    }

    private fetchFullInfo(id: string) {
        return this.slice.service.getFullInfo(id)
            .then(fullInfo => {
                if (fullInfo) 
                    return action(() => {
                            const item = this.slice.store.add({id, ...fullInfo})[0];
                            this.loadedItem = item;
                            this.state = LoadingState.idle;
                        })
                return null;
            })
    }

    private fetchDetails(id: string) {
        return this.slice.service.getDetails(id)
            .then(detailsInfo => {
                if (detailsInfo) 
                    return action(() => {
                        const item = this.slice.store.update({id, detailsInfo})[0]; 
                        this.loadedItem = item;
                        this.state = LoadingState.idle;
                    })
                return null;
            })
    }
}