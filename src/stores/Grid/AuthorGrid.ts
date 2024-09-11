import { action, computed, flow, makeObservable, observable } from "mobx";
import AuthorSlice from "../slices/AuthorSlice";
import { DBURLParams } from "../../services/DataService";
import Author, { AuthorDetailsInfo, AuthorPreviewInfo } from "../../utils/classes/Author";
import { AuthorSortOptions, AuthorSortTypes } from "../../utils/dbTypes";
import { Pathnames } from "../../utils/consts";
import { incrementStr, makeAbsolutePath } from "../../utils/helpers";
import GridStore, { CompareFn, FilterConfig } from "./GridStore";
import AuthorPreviewItem from "../../components/AuthorPreviewItem";

export default class AuthorGrid extends GridStore<AuthorPreviewInfo, AuthorDetailsInfo> {
    
    override slice: AuthorSlice;
    override rootPath = makeAbsolutePath(Pathnames.authors);
    override entityTitleName = "name";
    override ItemPreview = AuthorPreviewItem;

    constructor(slice: AuthorSlice) {
        super();
        
        this.slice = slice;

        makeObservable(this, {
            mainView: observable,
            filteredView: observable,
            sortOptions: observable,
            currentView: computed,
            previews: computed,
            lastPreview: computed,
            isNotInitialised: computed,
            isFull: computed,
            isLoading: computed,
            isError: computed,
            setSortOption: action.bound,
            loadPreviews: flow.bound
        })
    }

    override sortOptions : FilterConfig<AuthorSortTypes> = {
        name: 'sort',
        options: Object
            .entries(AuthorSortOptions)
            .map(([key, {text}]) => ({text, value: key})),
        selectedValue: null
    };

    override getParamsAndSortFn() {
        const selVal = this.sortOptions.selectedValue;

        let queryParams: DBURLParams;
        let sortFn : CompareFn<Author['previewInfo']>;
        let batchSizeExtentedBy = 0;

        switch (selVal) {
            case null:
                queryParams = {
                    orderBy: '$key',
                    limitToFirst: this.batchSize
                };
                if (this.lastPreview)
                    queryParams.startAt = incrementStr(this.lastPreview.id);

                sortFn = (a, b) => a.id < b.id ? -1 : 1;
                break;

            case AuthorSortTypes.name:
                queryParams = {
                    orderBy: AuthorSortOptions[selVal].dbKey,
                    limitToFirst: this.batchSize
                };
                if (this.lastPreview)
                    queryParams.startAt = incrementStr(this.lastPreview.name);
                
                sortFn = (a, b) => a.previewInfo.name < b.previewInfo.name ? -1 : 1;
                break;

            case AuthorSortTypes.books:
                queryParams = {
                    orderBy: AuthorSortOptions[selVal].dbKey,
                    limitToLast: this.batchSize
                };
                

                if (this.lastPreview) {
                    const authorWithSameNBooks = Array
                        .from(this.currentView.ids)
                        .map(id => this.slice.store.items.get(id))
                        .filter(item => (item &&
                            item.preview.bookN === this.lastPreview.bookN
                        ))
                        .length;

                    batchSizeExtentedBy = authorWithSameNBooks;
                    queryParams.limitToLast = this.batchSize + authorWithSameNBooks;
                    queryParams.endAt = this.lastPreview.bookN;
                }
                sortFn = (a, b) => b.previewInfo.bookN - a.previewInfo.bookN;
                break;
        }
        return {batchSizeExtentedBy, queryParams, sortFn};
    }
}