import { action, computed, flow, makeObservable, observable } from "mobx";
import StoreSlice from "../slices/StoreSlice";
import { PreviewsQueryParams } from "../../services/DataService";
import DefaultView from "./GridView/DefaultView";
import FilteredView from "./GridView/FilteredView";
import { PreviewConstraint as PC, DetailsConstraint as DC, FirestoreKeys as FK} from '../../utils/firestoreDbTypes';
import Entity from "../../utils/classes/Entity";
import { LoadingState } from "../../utils/consts";
import { EntityPreviewComponent } from "../../utils/uiTypes";
import SortSelect from "./SortSelect";

export default abstract class GridStore<P extends PC, D extends DC> {

    abstract slice: StoreSlice<P,D>;
    abstract rootPath: string;
    abstract entityTitleName: string;
    
    abstract sortSelect : SortSelect<P>;
    abstract ItemPreview : EntityPreviewComponent<P,D>;

    abstract get queryParams() : PreviewsQueryParams;
    abstract get currentFilterFn() : (p: Entity<P,D>['preview']) => boolean;
    
    defaultView : DefaultView<P, D>;
    filteredView : FilteredView<P, D>;
    nameFilter = '';
    
    constructor() {
        this.defaultView = new DefaultView(this);
        this.filteredView = new FilteredView(this);

        makeObservable(this, {
            nameFilter: observable,
            currentView: computed,
            initialiseStore: action.bound,
            applyNameFilter: action.bound,
            loadPreviews: flow.bound
        })
    }

    get currentView() {
        return (this.sortSelect.selectedOption || this.nameFilter) ? this.filteredView : this.defaultView;
    };

    initialiseStore() {
        if (this.defaultView.isNotInitialised && 
            this.currentView === this.defaultView && 
            this.currentView.isIdle)

            this.loadPreviews();
    }

    *loadPreviews() {

        this.currentView.setLoadingState(LoadingState.loading);

        let fetchedPreviews : Awaited<ReturnType<typeof this.slice.service.getPreviews>>;
        
        try {
            
            fetchedPreviews = yield this.slice.service.getPreviews(this.queryParams);

            const {previews: previewInits, lastSnap} = fetchedPreviews;

            const items = this.slice.store.add(...previewInits);
            
            this.currentView.addPreviews(items.map(item => item.preview), lastSnap);
        }
        catch (error) {
            // console.log(error);
            this.currentView.setLoadingState(LoadingState.error);
        }
    }

    applyNameFilter(value: string) {
        this.nameFilter = value;
    }

    protected applyFilters() {
        if (this.defaultView.isFull) 
            this.filterCachedPreviews();
        
        else {
            this.filteredView.reset();
            this.loadPreviews();
        }
    }

    protected filterCachedPreviews() {
        const filteredPreviews = this.defaultView.storedPreviews
            .filter(this.currentFilterFn)
            .sort(this.currentSortFn);
        
        this.filteredView.reset(filteredPreviews);
    }

    protected addNameFilterParams(params: PreviewsQueryParams) {

        if (this.nameFilter) {
            params.filters.push(...GridStore.makeNameFilterConstraint(this.nameFilter));
            params.sorts.push({ dbKey: FK.name_lowercase });
        }
    }

    protected addSortAndPagination(params: PreviewsQueryParams) {

        const selectedSort = this.sortSelect.getSelectedType();

        if (selectedSort) {
            const {dbKey, desc} = selectedSort
            params.sorts.push({dbKey: dbKey as FK, desc});
        }

        if (this.currentView.lastSnap) 
            params.lastSnap = this.currentView.lastSnap;
    };

    protected get currentSortFn() : (a: Entity<P,D>['preview'], b: Entity<P,D>['preview']) => number {
        const selectedSort = this.sortSelect.getSelectedType();
        
        if (selectedSort) {
            
            const {dbKey, desc} = selectedSort;

            if (desc)
                return (a, b) => a[dbKey] > b[dbKey] ? -1 : 1;

            return (a, b) => a[dbKey] < b[dbKey] ? -1 : 1;
        }

        return (a, b) => a[FK.name_lowercase] < b[FK.name_lowercase] ? -1 : 1;
    }

    static makeNameFilterConstraint(filterStr: string) {
        return [
            [FK.name_lowercase, '>=', filterStr],
            [FK.name_lowercase, '<=', `${filterStr}\uf8ff`]
        ] as NonNullable<PreviewsQueryParams['filters']>
    }
}