import { action, makeObservable } from "mobx";
import { DetailsConstraint, PreviewConstraint } from "../../../utils/firestoreDbTypes";
import Entity from "../../../utils/classes/Entity";
import PreviewsView from "../PreviewsView";
import GridView from './GridView';

export default class FilteredView<P extends PreviewConstraint, D extends DetailsConstraint> extends GridView<P, D> {

    constructor(previewsView: PreviewsView<P,D>) {
        super(previewsView);

        makeObservable(this, {
            reset: action
        })
    }

    reset(filteredItems?: Entity<P,D>[]) {
        this.storedItems = filteredItems || [];
        this.pageN = filteredItems ? 1 : 0;
        this.isFull = !!filteredItems;
        this.lastSnap = null;
    }
}