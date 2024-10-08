import { action, computed, flow, makeObservable, observable, reaction } from "mobx";
import { EntityPreviewComponent } from "../../utils/uiTypes";
import { LoadingState } from "../../utils/consts";
import Entity from "../../utils/classes/Entity";
import DataStore from "../DataStore/DataStore";
import GridView from "./grid/GridView";
import DefaultView from "./grid/DefaultView";
import FilteredView from "./grid/FilteredView";
import SortSettings from "./settings/SortSettings";
import FilterSettings from "./settings/FilterSettings";

export default abstract class PreviewsView<
    E extends Entity,
    FilterTypes extends string = any,
    SortTypes extends string = any
> {

    abstract entityTitleName: string;
    
    store: DataStore<E>;
    defaultView: DefaultView<E>;
    filteredView: FilteredView<E>;
    sortSettings: SortSettings<SortTypes, E>;
    filterSettings: FilterSettings<FilterTypes, E>;

    loadingState: LoadingState = LoadingState.idle;
    currentView: GridView<E>;

    abstract ItemPreview: EntityPreviewComponent<any>;

    constructor(store: DataStore<E>) {
        this.store = store;
        this.defaultView = new DefaultView(this);
        this.filteredView = new FilteredView(this);
        this.sortSettings = new SortSettings(store.sortConfig);
        this.filterSettings = new FilterSettings(store.filterConfig);

        this.currentView = this.defaultView;

        makeObservable(this, {
            loadingState: observable,
            currentView: observable,
            isInitialising: computed,
            isIdle: computed,
            isPending: computed,
            isError: computed,
            nameFilter: computed,
            setNameFilter: action.bound,
            loadPreviews: flow.bound
        });

        reaction(
            // react when any filter/sort setting have changed
            () => ({
                filters: this.filterSettings.allFilterValues,
                sort: this.sortSettings.selectedType
            }),
            ({ filters, sort }) => {
                // if any filter/sort options are applied, set filter view as current and apply filters
                if (sort || filters.reduce((acc, v) => acc || !!v, false)) {
                    this.currentView = this.filteredView;
                    
                    if (this.defaultView.isFull) {
                        const items = this.filterItemsLocally();
                        this.filteredView.reset(items);
                    }

                    else {
                        this.filteredView.reset();
                        this.loadPreviews();
                    }
                }
                // no options applied -> restore default view
                else {
                    this.defaultView.resetPagination();
                    this.currentView = this.defaultView;
                }
            }
        )
    }

    get isInitialising() {
        return this.loadingState === LoadingState.initialising;
    }

    get isIdle() {
        return this.loadingState === LoadingState.idle;
    }

    get isPending() {
        return this.loadingState === LoadingState.pending;
    }

    get isError() {
        return this.loadingState === LoadingState.error;
    }

    abstract get nameFilter() : string;

    abstract setNameFilter(filterStr: string): void;

    *loadPreviews() {
        this.loadingState = this.currentView.isNotInitialised ? LoadingState.initialising : LoadingState.pending;

        try {
            const params = this.getQueryParams();
            const { items, lastSnap }: Awaited<ReturnType<typeof this.store.fetchAndCachePreviews>> = (
                yield this.store.fetchAndCachePreviews(params)
            );
            this.currentView.addBatch(params.batchSize, items, lastSnap);
            this.loadingState = LoadingState.idle;
        }
        catch (error) {
            console.log(error);
            this.loadingState = LoadingState.error;
        }
    }

    initialiseView() {
        if (this.currentView.isNotInitialised && this.isIdle)
            this.loadPreviews();
    }

    resetSettings() {
        this.filterSettings.setToDefault()
        this.sortSettings.selectOption(null);
        this.defaultView.resetPagination();
    }

    private getQueryParams() {
        const {filters, sorts} = this.filterSettings.castToFirestoreParams();

        // ordering from sort option must come first for Firestore to order results properly
        sorts.unshift(...this.sortSettings.castToFirestoreParams());

        return {
            filters,
            sorts,
            batchSize: this.currentView.currentBatchSize,
            lastSnap: this.currentView.lastSnap || undefined
        }
    }

    private filterItemsLocally() {
        const filterFn = this.filterSettings.castToFilterFn();
        const sortFn = this.sortSettings.castToSortFn();

        return this.defaultView.storedItems
            .filter(filterFn)
            .sort(sortFn);
    }
}

