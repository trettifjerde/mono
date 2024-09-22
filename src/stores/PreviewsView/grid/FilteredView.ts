import { action, makeObservable } from "mobx";
import PreviewsView from "../PreviewsView";
import GridView from './GridView';
import Entity from "../../../utils/classes/Entity";

export default class FilteredView<E extends Entity> extends GridView<E> {

    constructor(previewsView: PreviewsView<E>) {
        super(previewsView);

        makeObservable(this, {
            reset: action
        })
    }

    reset(filteredItems?: E[]) {
        this.storedItems = filteredItems || [];
        this.pageN = filteredItems ? 1 : 0;
        this.isFull = !!filteredItems;
        this.lastSnap = null;
    }
}