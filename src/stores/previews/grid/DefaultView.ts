import { action, makeObservable } from "mobx";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore/lite";
import { DetailsConstraint, PreviewConstraint } from "../../../utils/firestoreDbTypes";
import Entity from "../../../utils/classes/Entity";
import PreviewsView from "../PreviewsView";
import GridView  from "./GridView";

export default class DefaultView<P extends PreviewConstraint, D extends DetailsConstraint> extends GridView<P, D> {

    constructor(previewsView: PreviewsView<P,D>) {
        super(previewsView);

        makeObservable(this, {
            resetPagination: action,
            clearFromCache: action
        })
    }

    override addItems(items: Entity<P, D>[], lastSnap: QueryDocumentSnapshot<P, DocumentData> | null) {
        super.addItems(items, lastSnap);

        if (this.isFull) 
            this.previewsView.store.setCacheFull();
    }

    resetPagination() {
        this.pageN = 1;
    }

    clearFromCache(id: string) {
        const index = this.storedItems.findIndex(item => item.id === id);
        if (index >= 0) 
            this.storedItems.splice(index, 1);
    }
}