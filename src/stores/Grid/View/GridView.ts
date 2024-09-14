import { QueryDocumentSnapshot } from "firebase/firestore/lite";
import GridStore, { CacheState } from "../GridStore";
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../../../utils/firestoreDbTypes';
import { LoadingState } from "../../../utils/consts";
import Entity from "../../../utils/classes/Entity";

export abstract class GridView<P extends PC, D extends DC> {

    gridStore: GridStore<P,D>;

    loadingState: LoadingState = LoadingState.idle;
    cacheState: CacheState = CacheState.notInitialised;
    lastSnap : QueryDocumentSnapshot<P> | null = null;

    constructor(gridStore: GridStore<P,D>) {
        this.gridStore = gridStore;
    }

    abstract get previews() : Entity<P,D>['preview'][];

    get isNotInitialised() {
        return this.cacheState === CacheState.notInitialised;
    }

    get isLoading() {
        return this.loadingState === LoadingState.loading;
    }

    get isFull() {
        return this.cacheState === CacheState.full;
    }

    get isError() {
        return this.loadingState === LoadingState.error;
    }

    addPreviews(items: Entity<P,D>[], lastSnap: QueryDocumentSnapshot<P> | null) {

        this.lastSnap = lastSnap;

        if (items.length < this.gridStore.slice.service.batchSize)
            this.cacheState = CacheState.full;

        else if (this.cacheState === CacheState.notInitialised) 
            this.cacheState =CacheState.initialised;            

        this.loadingState = LoadingState.idle;
    };

    setLoadingState(state: LoadingState) {
        this.loadingState = state;
    }
}