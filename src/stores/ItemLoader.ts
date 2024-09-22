import { action, computed, makeObservable, observable } from "mobx";
import { LoadingState } from "../utils/consts";
import DataStore from "./DataStore/DataStore";
import Entity from "../utils/classes/Entity";

export default abstract class ItemLoader< E extends Entity> {
    abstract store: DataStore<E>;

    state: LoadingState = LoadingState.idle;
    selectedId : string | null = null;
    loadedItem: E | null = null;
    redirectPath: string | null = null;

    constructor(public fallbackImg: string) {

        makeObservable(this, {
            state: observable,
            selectedId: observable,
            loadedItem: observable,
            redirectPath: observable,
            isInitialising: computed,
            isPending: computed,
            isNotFound: computed,
            isError: computed,
            isFailure: computed,
            setInitialising: action,
            setLoadedItem: action,
            setEmptyItem: action,
            setFailure: action,
            prepareItem: action.bound
        })
    }

    get isInitialising() {
        return this.state === LoadingState.initialising;
    }

    get isPending() {
        return this.state === LoadingState.pending;
    }

    get isNotFound() {
        return this.state === LoadingState.notFound;
    }

    get isError() {
        return this.state === LoadingState.error;
    }

    get isFailure() {
        return this.state === LoadingState.error || this.state === LoadingState.notFound;
    }

    setInitialising(id: string) {
        this.selectedId = id;
        this.loadedItem = null;
        this.state = LoadingState.initialising;
    }

    setEmptyItem() {
        this.selectedId = null;
        this.loadedItem = null;
        this.state = LoadingState.idle;
    }

    setLoadedItem(item: E) {
        this.selectedId = item.id;
        this.loadedItem = item;
        this.state = LoadingState.idle;
    }

    setFailure(state: LoadingState.notFound | LoadingState.error) {
        this.loadedItem = null;
        this.state = state;
    }

    prepareItem(pageItemId: string | null) {
        if (this.isInitialising)
            return;
        
        this.redirectPath = null;

        if (!pageItemId) 
            this.setEmptyItem();
        else 
            this.loadItem(pageItemId);
    }

    reloadItem() {
        if (this.selectedId)
            this.loadItem(this.selectedId);
    }

    private async loadItem(id: string) {
        this.setInitialising(id);

        try {
            const item = await this.store.getItem(id);

            if (item)
                this.setLoadedItem(item);
            else
                this.setFailure(LoadingState.notFound);
        }
        catch (error) {
            this.setFailure(LoadingState.error);
        }
    }
}