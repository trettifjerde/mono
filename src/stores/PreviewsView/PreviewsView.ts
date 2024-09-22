import { action, computed, flow, makeObservable, observable, reaction } from "mobx";
import { FirestoreQueryParams } from "../../utils/dataTypes";
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

    abstract pathname: string;
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
            isIdle: computed,
            isPending: computed,
            isError: computed,
            nameFilter: computed,
            setNameFilter: action.bound,
            initialiseView: action.bound,
            clearFilters: action,
            loadPreviews: flow.bound
        });

        reaction(
            // react when any filter/sort setting have changed
            () => ({
                filters: this.filterSettings.allFilterValues,
                sort: this.sortSettings.selectedType
            }),
            ({ filters, sort }) => {
                // if any filter/sort options are applied
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
                // no options applied -> restoring default view
                else {
                    this.defaultView.resetPagination();
                    this.currentView = this.defaultView;
                }
            }
        )
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

    clearFilters() {
        this.filterSettings.setToDefault()
        this.sortSettings.selectOption(null);
    }

    initialiseView() {
        if (this.currentView.isNotInitialised && this.isIdle)
            this.loadPreviews();
    }

    *loadPreviews() {
        this.loadingState = LoadingState.pending;

        try {
            const { items, lastSnap }: Awaited<ReturnType<typeof this.store.fetchAndCachePreviews>> = (
                yield this.store.fetchAndCachePreviews(this.getQueryParams())
            );
            this.currentView.addItems(items, lastSnap);
            this.loadingState = LoadingState.idle;
        }
        catch (error) {
            console.log(error);
            this.loadingState = LoadingState.error;
        }
    }

    private getQueryParams() {
        const params: FirestoreQueryParams<E> = this.filterSettings.castToFirestoreParams();

        // ordering from sort option must come first in order for Firestore to order results properly
        params.sorts = [
            ...this.sortSettings.castToFirestoreParams(),
            ...params.sorts
        ];

        if (this.currentView.lastSnap)
            params.lastSnap = this.currentView.lastSnap;

        return params;
    }

    private filterItemsLocally() {
        const filterFn = this.filterSettings.castToFilterFn();
        const sortFn = this.sortSettings.castToSortFn();

        return this.defaultView.storedItems
            .filter(filterFn)
            .sort(sortFn);
    }
}

