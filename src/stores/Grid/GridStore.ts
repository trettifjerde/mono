import StoreSlice from "../slices/StoreSlice";
import { PreviewsQueryParams } from "../../services/DataService";
import { PreviewConstraint as PC, DetailsConstraint as DC, FirestoreKeys } from '../../utils/firestoreDbTypes';
import { LoadingState } from "../../utils/consts";
import { DropdownOption, EntityPreviewComponent } from "../../utils/uiTypes";
import { DefaultView } from "./View/DefaultView";
import { FilteredView } from "./View/FilteredView";

export default abstract class GridStore<P extends PC, D extends DC> {

    abstract slice: StoreSlice<P,D>;
    abstract rootPath: string;
    abstract entityTitleName: string;
    
    abstract sortConfig: SortConfig<any, P>;
    abstract sortSettings: SelectSettings<any>;
    
    abstract ItemPreview : EntityPreviewComponent<P,D>;

    abstract get queryParams() : PreviewsQueryParams;
    
    defaultView : DefaultView<P, D>;
    filteredView : FilteredView<P, D>;
    nameFilter = '';
    
    constructor() {
        this.defaultView = new DefaultView(this);
        this.filteredView = new FilteredView(this);
    }

    get currentView() {
        return (this.sortSettings.selectedOption || this.nameFilter) ? this.filteredView : this.defaultView;
    };

    get isStoreNotInitialised() {
        return this.defaultView.cacheState === CacheState.notInitialised && 
            this.defaultView.loadingState === LoadingState.idle;
    }

    selectSortType(option: GridStore<P,D>['sortSettings']['options'][0] | null) {
        this.sortSettings.selectedOption = option;
    };

    applyNameFilter(value: string) {
        this.nameFilter = value;
    }

    *loadPreviews() {

        this.currentView.setLoadingState(LoadingState.loading);

        let fetchedSnaps : Awaited<ReturnType<typeof this.slice.service.getPreviews>>;
        
        try {
            
            fetchedSnaps = yield this.slice.service.getPreviews(this.queryParams);

            const {previews: previewInits, lastSnap} = fetchedSnaps;
            const items = this.slice.store.add(...previewInits);
            this.currentView.addPreviews(items, lastSnap);
        }
        catch (error) {
            // console.log(error);
            this.currentView.setLoadingState(LoadingState.error);
        }
    }

    protected applyFilters() {
        if (this.defaultView.cacheState === CacheState.full)
            this.filterCachedPreviews();

        else {
            this.filteredView.clear();
            this.loadPreviews();
        }
    }

    protected filterCachedPreviews() {

    }

    protected populateSortOptions() {
        for (const [sortType, info] of this.sortConfig)
            this.sortSettings.options.push({ value: sortType, text: info.text });
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