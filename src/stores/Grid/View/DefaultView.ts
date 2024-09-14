import { action, computed, makeObservable, observable } from "mobx";
import { QueryDocumentSnapshot } from "firebase/firestore/lite";
import GridStore from "../GridStore";
import { GridView } from "./GridView";
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../../../utils/firestoreDbTypes';
import Entity from "../../../utils/classes/Entity";

export class DefaultView<P extends PC, D extends DC> extends GridView<P, D> {

    storedIds : Set<string> = new Set();

    constructor(gridStore: GridStore<P,D>) {
        super(gridStore);

        makeObservable(this, {
            storedIds: observable,
            lastSnap: observable,
            cacheState: observable,
            loadingState: observable,
            previews: computed,
            isError: computed,
            isNotInitialised: computed,
            isFull: computed,
            isLoading: computed,
            addPreviews: action,
            setLoadingState: action
        })
    }

    override get previews() {
        const prevs : Entity<P,D>['preview'][] = [];

        this.storedIds.forEach(id => {
            const item = this.gridStore.slice.store.items.get(id);
            if (item)
                prevs.push(item.preview)
        });
        return prevs;
    }

    override addPreviews(items: Entity<P,D>[], lastSnap: QueryDocumentSnapshot<P> | null) {
        items.forEach(item => this.storedIds.add(item.id));

        super.addPreviews(items, lastSnap);
    }
}