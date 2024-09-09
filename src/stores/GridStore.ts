import { computed, flow, makeObservable, observable } from "mobx";
import StoreSlice from "./slices/StoreSlice";
import { LoadingState } from "../utils/consts";
import Entity, { PreviewConstraint as PC, DetailsConstraint as DC } from "../utils/classes/Entity";

export default class GridStore<P extends PC, D extends DC> {

    slice: StoreSlice<P,D>;
    rootPath: string;

    state: LoadingState = LoadingState.notInitialised;

    constructor ({slice, rootPath}: {slice: StoreSlice<P,D>, rootPath: string}) {
        this.slice = slice;
        this.rootPath = rootPath;

        makeObservable(this, {
            state: observable,
            previews: computed,
            fetchPreviews: flow.bound
        });
    }

    get previews() {
        const previews : Entity<P,D>['preview'][] = [];

        this.slice.store.items.forEach(item => {
            if (item.isInGrid)
                previews.push(item.preview)
        });
        return previews;
    }

    *fetchPreviews() {
        this.slice.grid.state = LoadingState.loading;

        let previews : Awaited<ReturnType<typeof this.slice.service.getPreviews>>;

        try {
            previews = yield this.slice.service.getPreviews();

            this.slice.store.add(true, ...previews);
            this.state = LoadingState.idle;
        }
        catch (error) {
            console.log(error);
            this.state = LoadingState.error;
        }
    }
}