import { action, computed, makeObservable, observable } from "mobx";
import { QueryDocumentSnapshot } from "firebase/firestore/lite";
import GridStore, { CacheState } from "../GridStore";
import { GridView } from "./GridView";
import Entity from "../../../utils/classes/Entity";
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../../../utils/firestoreDbTypes';
import { LoadingState } from "../../../utils/consts";

export class FilteredView<P extends PC, D extends DC> extends GridView<P, D> {

    storedPreviews : Entity<P,D>['preview'][] = [];

    constructor(gridStore: GridStore<P,D>) {
        super(gridStore);

        makeObservable(this, {
            storedPreviews: observable,
            lastSnap: observable,
            cacheState: observable,
            loadingState: observable,
            previews: computed,
            isError: computed,
            isNotInitialised: computed,
            isFull: computed,
            isLoading: computed,
            addPreviews: action,
            setLoadingState: action,
            clear: action
        })
    }

    override get previews() {
        return this.storedPreviews;
    }

    override addPreviews(items: Entity<P,D>[], lastSnap: QueryDocumentSnapshot<P> | null) {
        this.storedPreviews.push(...items.map(item => item.preview));
        super.addPreviews(items, lastSnap);
    }

    clear() {
        this.storedPreviews = [];
        this.lastSnap = null;
        this.cacheState = CacheState.notInitialised;
        this.loadingState = LoadingState.idle;
    }
}