import { action, computed, makeObservable, observable } from "mobx";
import { QueryDocumentSnapshot } from "firebase/firestore/lite";
import GridStore from "../GridStore";
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../../../utils/firestoreDbTypes';
import Entity from "../../../utils/classes/Entity";
import { LoadingState } from "../../../utils/consts";

export abstract class GridView<P extends PC, D extends DC> {

    gridStore: GridStore<P,D>;

    storedPreviews: Entity<P,D>['preview'][] = [];
    lastSnap : QueryDocumentSnapshot<P> | null = null;
    loadingState: LoadingState = LoadingState.idle;
    pageN = 0;
    isFull = false;

    constructor(gridStore: GridStore<P,D>) {
        this.gridStore = gridStore;

        makeObservable(this, {
            storedPreviews: observable,
            lastSnap: observable,
            loadingState: observable,
            pageN: observable,
            isFull: observable,
            isNotInitialised: computed,
            isIdle: computed,
            isLoading: computed,
            isError: computed,
            isLastPage: computed,
            isPrevBtnVisible: computed,
            isNextBtnVisible: computed,
            currentPagePreviews: computed,
            showPrev: action.bound,
            showNext: action.bound,
            addPreviews: action,
            setLoadingState: action
        })
    }

    get isNotInitialised() {
        return this.pageN === 0;
    }

    get isIdle() {
        return this.loadingState === LoadingState.idle;
    }

    get isLoading() {
        return this.loadingState === LoadingState.loading;
    }

    get isError() {
        return this.loadingState === LoadingState.error;
    }

    get isLastPage() {
        return this.pageN >= (this.storedPreviews.length / this.gridStore.slice.service.batchSize);
    }

    get isPrevBtnVisible() {
        return this.pageN > 1;
    }

    get isNextBtnVisible() {
        return !this.isLastPage || !this.isFull;
    }

    get currentPagePreviews() {
        const batchSize = this.gridStore.slice.service.batchSize;
        const startIndex = (this.pageN - 1) * batchSize;
        const endIndex = startIndex + batchSize;

        return this.storedPreviews.slice(startIndex, endIndex);
    }

    showPrev() {
        this.pageN -= 1;
    }

    showNext() {
        if (!this.isLastPage)
            this.pageN += 1;

        else if (!this.isFull)
            this.gridStore.loadPreviews();
    }

    addPreviews(previews: Entity<P,D>['preview'][], lastSnap: QueryDocumentSnapshot<P> | null) {
        this.storedPreviews.push(...previews);
        this.lastSnap = lastSnap;

        if (previews.length) 
            this.pageN++;

        if (previews.length < this.gridStore.slice.service.batchSize)
            this.isFull = true;         

        this.loadingState = LoadingState.idle;
    };

    setLoadingState(state: LoadingState) {
        this.loadingState = state;
    }
}