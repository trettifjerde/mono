import { action, computed, makeObservable, observable } from "mobx";
import { QueryDocumentSnapshot } from "firebase/firestore/lite";
import { DetailsConstraint, PreviewConstraint } from "../../../utils/firestoreDbTypes";
import Entity from "../../../utils/classes/Entity";
import PreviewsView from "../PreviewsView";

export default abstract class GridView<P extends PreviewConstraint, D extends DetailsConstraint> {

    previewsView: PreviewsView<P,D>;

    storedItems: Entity<P,D>[] = [];
    lastSnap : QueryDocumentSnapshot<P> | null = null;
    pageN = 0;
    isFull = false;

    constructor(previewsView: PreviewsView<P,D>) {
        this.previewsView = previewsView;

        makeObservable(this, {
            storedItems: observable,
            lastSnap: observable,
            pageN: observable,
            isFull: observable,
            isNotInitialised: computed,
            isLastPage: computed,
            isPrevBtnVisible: computed,
            isNextBtnVisible: computed,
            pagePreviews: computed,
            showPrev: action.bound,
            showNext: action.bound,
            addItems: action,
        })
    }

    get isNotInitialised() {
        return this.pageN === 0;
    }

    get isLastPage() {
        return this.pageN >= (this.storedItems.length / this.previewsView.store.batchSize);
    }

    get isPrevBtnVisible() {
        return this.pageN > 1;
    }

    get isNextBtnVisible() {
        return !this.isLastPage || !this.isFull;
    }

    get pagePreviews() {
        const batchSize = this.previewsView.store.batchSize;
        const startIndex = (this.pageN - 1) * batchSize;
        const endIndex = startIndex + batchSize;

        return this.storedItems
            .slice(startIndex, endIndex)
            .map(item => item.preview);
    }

    showPrev() {
        this.pageN -= 1;
    }

    showNext() {
        if (!this.isLastPage)
            this.pageN += 1;

        else if (!this.isFull)
            this.previewsView.loadPreviews();
    }

    addItems(items: Entity<P,D>[], lastSnap: QueryDocumentSnapshot<P> | null) {
        this.storedItems.push(...items);
        this.lastSnap = lastSnap;

        if (items.length) 
            this.pageN++;

        if (items.length < this.previewsView.store.batchSize)
            this.isFull = true;         
    };
}