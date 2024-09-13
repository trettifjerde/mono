
import { QueryDocumentSnapshot } from "firebase/firestore/lite";
import StoreSlice from "../slices/StoreSlice";
import { PreviewsQueryParams } from "../../services/DataService";
import { PreviewConstraint as PC, DetailsConstraint as DC, FirestoreKeys } from '../../utils/firestoreDbTypes';
import Entity from "../../utils/classes/Entity";
import { LoadingState } from "../../utils/consts";
import { DropdownOption, EntityPreviewComponent } from "../../utils/uiTypes";

export default abstract class GridStore<P extends PC, D extends DC> {

    abstract slice: StoreSlice<P,D>;
    abstract rootPath: string;
    abstract entityTitleName: string;
    
    abstract sortConfig: SortConfig<any, P>;
    abstract sortSettings: SelectSettings<any>;
    nameFilter = '';
    abstract ItemPreview : EntityPreviewComponent<P,D>;

    defaultView : GridView<P>;
    filteredView : GridView<P>;

    constructor() {
        this.defaultView = this.getCleanView();
        this.filteredView = this.getCleanView();
    }

    get currentView() {
        return (this.sortSettings.selectedOption || this.nameFilter) ? this.filteredView : this.defaultView;
    };

    get isStoreNotInitialised() {
        return this.defaultView.cacheState === CacheState.notInitialised && 
            this.defaultView.loadingState === LoadingState.idle;
    }

    get isNotInitialised() {
        return this.currentView.cacheState === CacheState.notInitialised;
    }

    get isLoading() {
        return this.currentView.loadingState === LoadingState.loading;
    }

    get isFull() {
        return this.currentView.cacheState === CacheState.full;
    }

    get isError() {
        return this.currentView.loadingState === LoadingState.error;
    }

    get previews() {
        const prevs : Entity<P,D>['preview'][] = [];

        this.currentView.ids.forEach(id => {
            const item = this.slice.store.items.get(id);
            if (item)
                prevs.push(item.preview)
        })

        return prevs;
    }

    selectSortType(option: GridStore<P,D>['sortSettings']['options'][0] | null) {
        this.sortSettings.selectedOption = option;
    };

    applyNameFilter(value: string) {
        this.nameFilter = value;
    }

    *loadPreviews() {

        this.currentView.loadingState = LoadingState.loading;

        let fetchedSnaps : Awaited<ReturnType<typeof this.slice.service.getPreviews>>;
        
        try {
            
            fetchedSnaps = yield this.slice.service.getPreviews(this.queryParams);
            const {previews: fetchedPreviews, lastSnap} = fetchedSnaps;

            this.currentView.lastSnap = lastSnap;

            fetchedPreviews
                .forEach(preview => {
                    this.slice.store.add(preview);
                    this.currentView.ids.add(preview.id);
                })
            
            if (fetchedPreviews.length < this.slice.service.batchSize)
                this.currentView.cacheState = CacheState.full;

            else if (this.currentView.cacheState === CacheState.notInitialised) 
                this.currentView.cacheState = CacheState.initialised;            

            this.currentView.loadingState = LoadingState.idle;
        }
        catch (error) {
            this.currentView.loadingState = LoadingState.error;
        }
    }

    abstract get queryParams() : PreviewsQueryParams;

    protected populateSortOptions() {
        for (const [sortType, info] of this.sortConfig)
            this.sortSettings.options.push({ value: sortType, text: info.text });
    }

    protected getCleanView() : GridView<P> {
        return {
            ids: new Set(),
            cacheState: CacheState.notInitialised,
            loadingState: LoadingState.idle,
            lastSnap: null
        };
    }

    protected applyFilters() {
        this.filteredView = this.getCleanView();
        this.loadPreviews();
    }

    protected addNameFilterParams(params: PreviewsQueryParams) {

        if (this.nameFilter) {
            params.filters.push(...GridStore.makeNameFilterConstraint(this.nameFilter));
            params.sorts.push({ key: FirestoreKeys.name_lowercase });
        }
    }

    protected addSortAndPagination(params: PreviewsQueryParams) {

        const selectedSort = this.sortSettings.selectedOption && this.sortConfig.get(this.sortSettings.selectedOption.value);

        if (selectedSort) {
            const {dbKey, desc} = selectedSort;
            params.sorts.push({key: dbKey as FirestoreKeys, desc});
        }

        if (this.currentView.lastSnap) 
            params.lastSnap = this.currentView.lastSnap;
    };

    static makeNameFilterConstraint(filterStr: string) {
        return [
            [FirestoreKeys.name_lowercase, '>=', filterStr],
            [FirestoreKeys.name_lowercase, '<=', `${filterStr}\uf8ff`]
        ] as NonNullable<PreviewsQueryParams['filters']>
    }
}

export type SortConfig<Key, P extends PC> = Map<Key, {
    dbKey: keyof P, 
    text: string,
    desc?: 'desc'
}>

export type SelectSettings<T> = {
    options: DropdownOption<T>[];
    selectedOption: DropdownOption<T> | null;
}

export enum CacheState {
    notInitialised,
    initialised,
    full
}

type GridView<P> = {
    ids: Set<string>,
    lastSnap : QueryDocumentSnapshot<P> | null,
    cacheState: CacheState,
    loadingState: LoadingState
}