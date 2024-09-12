
import StoreSlice from "../slices/StoreSlice";
import Entity from "../../utils/classes/Entity";
import { PreviewsQueryParams } from "../../services/DataService";
import { LoadingState } from "../../utils/consts";
import { DropdownOption, EntityPreviewComponent } from "../../utils/uiTypes";
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../../utils/firestoreDbTypes';

export default abstract class GridStore<P extends PC, D extends DC> {

    abstract slice: StoreSlice<P,D>;
    abstract rootPath: string;
    abstract entityTitleName: string;
    
    abstract sortOptions: FilterConfig<any>;
    abstract ItemPreview : EntityPreviewComponent<P,D>;

    mainView : GridView;
    filteredView : GridView;
    filterString = '';

    constructor() {
        this.mainView = this.getCleanView();
        this.filteredView = this.getCleanView();
    }

    get currentView() {
        return (this.sortOptions.selectedOption || this.filterString) ? this.filteredView : this.mainView;
    };

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
            if (item && item.preview.name.toLowerCase().includes(this.filterString))
                prevs.push(item.preview)
        })

        return prevs;
    }

    get lastPreview() {
        return this.previews[this.previews.length - 1] || null;
    }

    setSortOption(option: DropdownOption<GridStore<P,D>['sortOptions']['options'][0]['value']> | null) {
        this.sortOptions.selectedOption = option;
        this.filteredView = this.getCleanView();
    };

    applyFilterString(value: string) {
        this.filterString = value.toLowerCase();
        this.filteredView = this.getCleanView();
    }

    *loadPreviews() {

        this.currentView.loadingState = LoadingState.loading;

        let fetchedPreviews : Awaited<ReturnType<typeof this.slice.service.getPreviews>>;
        
        try {
            
            fetchedPreviews = yield this.slice.service.getPreviews(this.queryParams);

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
            console.log(error);
            this.currentView.loadingState = LoadingState.error;
        }
    }

    abstract get queryParams() : PreviewsQueryParams;

    protected getCleanView() : GridView {
        return {
            ids: new Set(),
            cacheState: CacheState.notInitialised,
            loadingState: LoadingState.idle
        }
    }
}

export type FilterConfig<T> = {
    name: string;
    label: string;
    placeholder: string;
    options: DropdownOption<T>[];
    selectedOption: DropdownOption<T> | null;
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