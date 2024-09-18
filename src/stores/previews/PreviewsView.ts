import { action, computed, flow, makeObservable, observable, reaction } from "mobx";
import { WhereFilterOp } from "firebase/firestore/lite";
import { DetailsConstraint, FirestoreKeys, FirestoreQueryParams, PreviewConstraint } from "../../utils/firestoreDbTypes";
import { FilterConfig, SortConfig } from "../../utils/dataTypes";
import { EntityPreviewComponent } from "../../utils/uiTypes";
import { LoadingState } from "../../utils/consts";
import DataStore from "../data/DataStore";
import GridView from "./grid/GridView";
import DefaultView from "./grid/DefaultView";
import FilteredView from "./grid/FilteredView";
import SortSettings from "./settings/SortSettings";
import FilterSettings from "./settings/FilterSettings";

export default abstract class PreviewsView<
    P extends PreviewConstraint,
    D extends DetailsConstraint,
    FilterTypes extends string = any,
    SortTypes extends string = any
> {

    abstract store: DataStore<P, D>;
    abstract rootPath: string;
    abstract entityTitleName: string;

    loadingState: LoadingState = LoadingState.idle;
    defaultView: DefaultView<P, D>;
    filteredView: FilteredView<P, D>;
    currentView: GridView<P, D>;

    sortSettings: SortSettings<SortTypes, P, D>;
    filterSettings: FilterSettings<FilterTypes, P, D>;

    abstract ItemPreview: EntityPreviewComponent<P, D>;

    constructor(filterConfig: FilterConfig<FilterTypes, P>, sortConfig: SortConfig<SortTypes, P>) {
        this.defaultView = new DefaultView(this);
        this.filteredView = new FilteredView(this);
        this.currentView = this.defaultView;

        this.sortSettings = new SortSettings(sortConfig);
        this.filterSettings = new FilterSettings(filterConfig);

        makeObservable(this, {
            loadingState: observable,
            defaultView: observable,
            filteredView: observable,
            currentView: observable,
            sortSettings: observable,
            filterSettings: observable,
            isIdle: computed,
            isLoading: computed,
            isError: computed,
            initialiseView: action.bound,
            setNameFilter: action.bound,
            loadPreviews: flow.bound,
        });

        reaction(
            () => ({
                filters: this.filterSettings.allFilterValues,
                sort: this.sortSettings.selectedType
            }),
            ({ filters, sort }) => {
                
                if (sort || filters.reduce((acc, v) => acc || !!v, false)) {
                    this.currentView = this.filteredView;

                    if (this.defaultView.isFull) 
                        this.filteredView.reset(this.getLocallyFilteredItems())

                    else {
                        this.filteredView.reset();
                        this.loadPreviews();
                    }
                }
                
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

    get isLoading() {
        return this.loadingState === LoadingState.loading;
    }

    get isError() {
        return this.loadingState === LoadingState.error;
    }

    initialiseView() {
        if (this.currentView.isNotInitialised && this.isIdle)
            this.loadPreviews();
    }

    *loadPreviews() {
        this.loadingState = LoadingState.loading;

        let fetchedItems: Awaited<ReturnType<typeof this.store.fetchAndCachePreviews>>;

        try {
            fetchedItems = yield this.store.fetchAndCachePreviews(this.getQueryParams());
            const { items, lastSnap } = fetchedItems;
            this.currentView.addItems(items, lastSnap);
            this.loadingState = LoadingState.idle;
        }
        catch (error) {
            // console.log(error);
            this.loadingState = LoadingState.error;
        }
    }


    getQueryParams() {
        const params: FirestoreQueryParams<P> = this.filterSettings.castToFirestoreParams();

        params.sorts = [
            ...this.sortSettings.castToFirestoreParams(),
            ...params.sorts
        ]

        if (this.currentView.lastSnap)
            params.lastSnap = this.currentView.lastSnap;

        return params;
    }

    getLocallyFilteredItems() {
        const filterFn = this.filterSettings.castToFilterFn();
        const sortFn = this.sortSettings.castToSortFn();

        return this.defaultView.storedItems
            .filter(filterFn)
            .sort(sortFn);
    }

    abstract setNameFilter(value: string) : void;
}

export enum BaseFilterTypes {
    name = "name"
}

export const NameFilterConfig = {
    field: FirestoreKeys.name_lowercase as FirestoreKeys.name_lowercase,
    initialValue: '',
    constraints: [
        {
            op: '>=' as WhereFilterOp,
            makeValue: (v: string) => v
        },
        {
            op: '<=' as WhereFilterOp,
            makeValue: (v: string) => `${v}\uf8ff`
        }
    ]
}

