
import StoreSlice from "../slices/StoreSlice";
import { DBURLParams } from "../../services/DataService";
import Entity, { PreviewConstraint as PC, DetailsConstraint as DC } from "../../utils/classes/Entity";
import { FETCH_BATCH_SIZE, LoadingState } from "../../utils/consts";
import { DropdownOption, EntityPreviewComponent } from "../../utils/uiTypes";

export default abstract class GridStore<P extends PC, D extends DC> {

    readonly batchSize = FETCH_BATCH_SIZE;

    abstract slice: StoreSlice<P,D>;
    abstract rootPath: string;
    abstract entityTitleName: string;
    abstract sortOptions : FilterConfig<any>;

    abstract getParamsAndSortFn() : {
        batchSizeExtentedBy: number,
        queryParams: DBURLParams, 
        sortFn: CompareFn<P>
    };
    abstract ItemPreview : EntityPreviewComponent<P,D>;

    mainView : GridView;
    filteredView : GridView;

    constructor() {
        this.mainView = this.getCleanView();
        this.filteredView = this.getCleanView();
    }

    get currentView() {
        return !this.sortOptions.selectedValue ? this.mainView : this.filteredView;
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

    get lastPreview() {
        return this.previews[this.previews.length - 1] || null;
    }

    setSortOption(value: any) {
        this.sortOptions.selectedValue = value;
        this.filteredView = this.getCleanView();
    };

    *loadPreviews() {

        this.currentView.loadingState = LoadingState.loading;

        let fetchedPreviews : Awaited<ReturnType<typeof this.slice.service.getPreviews>>;
        
        try {
            const {batchSizeExtentedBy, queryParams, sortFn} = this.getParamsAndSortFn();
            fetchedPreviews = yield this.slice.service.getPreviews(queryParams);

            fetchedPreviews
                .sort(sortFn)
                .forEach(preview => {
                    this.slice.store.add(preview);
                    this.currentView.ids.add(preview.id);
                })
            
            if (fetchedPreviews.length < (this.batchSize + batchSizeExtentedBy))
                this.currentView.cacheState = CacheState.full;

            else if (this.currentView.cacheState === CacheState.notInitialised) 
                this.currentView.cacheState = CacheState.initialised;            

            this.currentView.loadingState = LoadingState.idle;
        }
        catch (error) {
            console.log(error);
            this.currentView.loadingState = LoadingState.error;
        }
    }

    protected getCleanView() : GridView {
        return {
            ids: new Set(),
            cacheState: CacheState.notInitialised,
            loadingState: LoadingState.idle
        }
    }
}

export enum CacheState {
    notInitialised,
    initialised,
    full
}

type GridView = {
    ids: Set<string>,
    cacheState: CacheState,
    loadingState: LoadingState
}

export type FilterConfig<T> = {
    name: string,
    options: DropdownOption[],
    selectedValue: T | null;
}

export type CompareFn<P> = (a: {id: string, previewInfo: P}, b: {id: string, previewInfo: P}) => number;