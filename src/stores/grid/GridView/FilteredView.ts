import { action, makeObservable } from "mobx";
import GridStore from "../GridStore";
import { GridView } from "./GridView";
import Entity from "../../../utils/classes/Entity";
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../../../utils/firestoreDbTypes';
import { LoadingState } from "../../../utils/consts";

export default class FilteredView<P extends PC, D extends DC> extends GridView<P, D> {

    constructor(gridStore: GridStore<P,D>) {
        super(gridStore);

        makeObservable(this, {
            reset: action
        })
    }

    reset(filteredPreviews?: Entity<P,D>['preview'][]) {
        this.storedPreviews = filteredPreviews || [];
        this.pageN = filteredPreviews ? 1 : 0;
        this.isFull = !!filteredPreviews;
        this.lastSnap = null;
        this.loadingState = LoadingState.idle;
    }
}