import { action, makeObservable } from "mobx";
import PreviewsView from "../PreviewsView";
import GridView from './GridView';
import Entity from "../../../utils/classes/Entity";

export default class FilteredView<P, D> extends GridView<P, D> {

    constructor(previewsView: PreviewsView<P, D>) {
        super(previewsView);

        makeObservable(this, {
            reset: action
        })
    }

    reset(filteredItems?: Entity<P, D>[]) {
        this.storedItems = filteredItems || [];
        this.pageN = filteredItems ? 1 : 0;
        this.isFull = !!filteredItems;
        this.lastSnap = null;
    }
}