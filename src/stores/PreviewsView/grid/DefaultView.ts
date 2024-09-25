import { action, makeObservable } from "mobx";
import { PreviewShapshot } from "../../../utils/dataTypes";
import Entity from "../../../utils/classes/Entity";
import PreviewsView from "../PreviewsView";
import GridView  from "./GridView";

export default class DefaultView<E extends Entity> extends GridView<E> {

    constructor(previewsView: PreviewsView<E>) {
        super(previewsView);

        makeObservable(this, {
            resetPagination: action,
            removeItemFromCache: action
        })
    }

    override addBatch(batchSize: number, items: E[], lastSnap: PreviewShapshot<E> | null) {
        super.addBatch(batchSize, items, lastSnap);

        if (this.isFull) 
            this.previewsView.store.setCacheFull();
    }

    resetPagination() {
        if (this.isNotInitialised)
            return;
        
        this.pageN = 1;
    }

    removeItemFromCache(id: string) {
        const index = this.storedItems.findIndex(item => item.id === id);
        if (index >= 0) 
            this.storedItems.splice(index, 1);
    }
}