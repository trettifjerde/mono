import { action, computed, makeObservable, observable } from "mobx";
import { LoadingState } from "../../utils/consts";
import DataStore from "../data/DataStore";
import Entity from "../../utils/classes/Entity";

export default abstract class DetailsView<P, D> {
    abstract store: DataStore<P, D>;

    state: LoadingState = LoadingState.idle;
    selectedId = '';
    loadedItem: Entity<P,D> | null = null;

    abstract fallbackImg: string;
    abstract HeaderComponent: any;

    constructor() {

        makeObservable(this, {
            state: observable,
            selectedId: observable,
            loadedItem: observable,
            isNotFound: computed,
            isError: computed,
            isFailure: computed,
            isLoading: computed,
            headerContent: computed,
            setLoadedItem: action,
            setLoading: action,
            setFailure: action,
            prepareItem: action.bound
        })
    }

    get headerContent() {
        switch (this.state) {
            case LoadingState.error:
            case LoadingState.notFound:
                return 'Oops';

            default:
                return this.loadedItem?.preview.name || '';
        }
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
    
    get isLoading() {
        return this.state === LoadingState.loading;
    }

    setLoading(id: string) {
        this.selectedId = id;
        this.loadedItem = null;
        this.state = LoadingState.loading;
    }

    setLoadedItem(item: Entity<P,D>) {
        this.selectedId = item.id;
        this.loadedItem = item;
        this.state = LoadingState.idle;
    }

    setFailure(state: LoadingState.notFound | LoadingState.error) {
        this.loadedItem = null;
        this.state = state;
    }

    async prepareItem(id?: string) {

        if (this.selectedId === id)
            return;

        if (!id)
            id = this.selectedId;
        
        this.setLoading(id);

        try {
            const item = await this.store.getItemFullInfo(id);

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