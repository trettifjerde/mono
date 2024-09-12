import { action, computed, flow, makeObservable, observable } from "mobx";
import { documentId } from "firebase/firestore/lite";
import AuthorSlice from "../slices/AuthorSlice";
import { PreviewsQueryParams } from "../../services/DataService";
import { AuthorDetails, AuthorPreview } from "../../services/AuthorService";
import GridStore, { FilterConfig } from "./GridStore";
import { FirestoreAuthor, FirestoreKeys } from "../../utils/firestoreDbTypes";
import { Pathnames } from "../../utils/consts";
import { makeAbsolutePath } from "../../utils/helpers";
import AuthorPreviewItem from "../../components/AuthorPreviewItem";

export default class AuthorGrid extends GridStore<AuthorPreview, AuthorDetails> {
    
    override slice: AuthorSlice;
    override rootPath = makeAbsolutePath(Pathnames.authors);
    override entityTitleName = "author name";
    override ItemPreview = AuthorPreviewItem;
    override sortOptions: FilterConfig<AuthorSortTypes> = {
        name: 'sort',
        label: 'Sort by',
        placeholder: 'Select type',
        options: Object.entries(AuthorSortOptions)
            .map(([key, {text}]) => (
                {value: key as AuthorSortTypes, text}
            )),
        selectedOption: null            
    }

    override get queryParams(): PreviewsQueryParams {
        const params : PreviewsQueryParams = {};

        if (this.filterString) {
            params.filters = [[FirestoreKeys.name_lowercase, this.filterString]];
        }

        const sortOption = this.sortOptions.selectedOption?.value;

        if (sortOption) {
            const {dbKey, isDesc} = AuthorSortOptions[sortOption];
            params.sort = {dbKey, isDesc};

            if (this.lastPreview) {
                params.lastItemValue = this.lastPreview[dbKey];
                params.sort = {dbKey, isDesc: false};
            }  
        }
        else {
            params.sort = {dbKey: documentId(), isDesc: false};

            if (this.lastPreview) {
                params.lastItemValue = this.lastPreview[FirestoreKeys.name_lowercase];
            }
        }

        return params;
    }

    constructor(slice: AuthorSlice) {
        super();
        
        this.slice = slice;

        this.sortOptions.options = Object
            .entries(AuthorSortOptions)
            .map(([key, {text}]) => ({text, value: key as AuthorSortTypes}));

        makeObservable(this, {
            mainView: observable,
            filteredView: observable,
            sortOptions: observable,
            filterString: observable,
            currentView: computed,
            previews: computed,
            lastPreview: computed,
            isNotInitialised: computed,
            isFull: computed,
            isLoading: computed,
            isError: computed,
            setSortOption: action.bound,
            applyFilterString: action.bound,
            loadPreviews: flow.bound
        })
    }
}

export enum AuthorSortTypes {
    name = "name",
    books = "books"
};

export const AuthorSortOptions = {
    [AuthorSortTypes.name]: {
        dbKey: FirestoreKeys.name_lowercase as keyof FirestoreAuthor,
        text: "Author name",
        isDesc: false
    },
    [AuthorSortTypes.books]: {
        dbKey: FirestoreKeys.bookN as keyof FirestoreAuthor,
        text: "Number of books",
        isDesc: true
    },
}