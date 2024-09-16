import { action, computed, makeObservable, observable } from "mobx";
import StoreSlice from "../slices/StoreSlice";
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../../utils/firestoreDbTypes';
import { LoadingState } from "../../utils/consts";
import Entity from "../../utils/classes/Entity";

export default abstract class DetailsView <P extends PC, D extends DC> {
    slice: StoreSlice<P, D>;

    state: LoadingState = LoadingState.idle;
    selectedId = '';
    loadedItem: Entity<P, D> | null = null;

    abstract fallbackImg: string;
    abstract HeaderComponent: ((props: {item: Entity<P,D> | null}) => JSX.Element) | null;

    constructor(slice: StoreSlice<P, D>) {
        this.slice = slice;

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

    async prepareItem(id?: string) {

        if (this.selectedId === id)
            return;

        if (!id)
            id = this.selectedId;
        
        const existingItem = this.slice.dataStore.items.get(id);
        
        if (existingItem && existingItem.details) {
            this.setLoadedItem(existingItem);
            return;
        }

        this.setLoading(id);

        try {
            const fetchInfoFn = existingItem ? this.fetchDetails : this.fetchFullInfo;
            
            const item = await fetchInfoFn.call(this, id);

            if (item)
                this.setLoadedItem(item);

            else
                this.setFailure(LoadingState.notFound);
        }
        catch (error) {
            this.setFailure(LoadingState.error);
        }
    }

    fetchFullInfo(id: string) {
        return this.slice.service.getFullInfo(id)
            .then(fullInfo => {
                if (!fullInfo) 
                    return null;

                return this.slice.dataStore.add({id, ...fullInfo})[0];
            })
    }

    fetchDetails(id: string) {
        return this.slice.service.getDetails(id)
            .then(detailsInfo => {
                if (!detailsInfo) 
                    return null;

                return this.slice.dataStore.update({id, detailsInfo})[0]; 
            })
    }
}