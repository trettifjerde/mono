import { action, computed, flow, makeObservable, observable } from "mobx";
import { DropdownOption, Suggestion } from "../../utils/uiTypes";
import { LoadingState } from "../../utils/consts";

export type SuggestionsFetcherFn<K extends string> = (filterSt: string) => Promise<{
    suggestions: Suggestion<K>[],
    fromDataStoreCache: boolean
 } | null>

type FetcherResponse<Key extends string> = Awaited<ReturnType<SuggestionsFetcherFn<Key>>>;

export default class DynamicSelectSettings<Key extends string> {

    //observables
    state: LoadingState = LoadingState.idle;
    isDropdownVisible = false;
    options: DropdownOption<Key>[] = [];
    cache: Map<string, DropdownOption<Key>[]> = new Map();
    lastSelectedOptionText = '';

    //config
    selectNullOptionOnEmptyFilter: boolean;
    clearFilterOnOptionSelect: boolean;
    fetchSuggestions: SuggestionsFetcherFn<Key>;
    onOptionSelect: (option: DropdownOption<Key> | null) => void;

    constructor(config: {
        fetchFn: SuggestionsFetcherFn<Key>,
        onSelect: (option: DropdownOption<Key> | null) => void,
        selectNull: boolean,
        clearFilter: boolean
    }) {

        this.selectNullOptionOnEmptyFilter = config.selectNull;
        this.clearFilterOnOptionSelect = config.clearFilter;
        this.fetchSuggestions = config.fetchFn;
        this.onOptionSelect = config.onSelect;

        makeObservable(this, {
            state: observable,
            isDropdownVisible: observable,
            options: observable,
            cache: observable,
            lastSelectedOptionText: observable,
            isPending: computed,
            isError: computed,
            openDropdown: action.bound,
            toggleDropdown: action.bound,
            selectOption: action.bound,
            clear: action.bound,
            filterOptions: flow.bound
        });
    }

    get isPending() {
        return this.state === LoadingState.pending;
    }

    get isError() {
        return this.state === LoadingState.error;
    }

    openDropdown() {
        if (this.options.length) 
            this.isDropdownVisible = true;
    }

    toggleDropdown(flag: boolean) {
        this.isDropdownVisible = flag;
    }

    selectOption(option: typeof this.options[0] | null) {
        this.options = [];
        this.lastSelectedOptionText = option?.text || '';
        this.onOptionSelect(option);
    };

    clear() {
        this.state = LoadingState.idle;
        this.isDropdownVisible = false;
        this.options = [];
        this.cache = new Map();
        this.lastSelectedOptionText = '';
    }

    *filterOptions(filterStr: string) {

        let cacheKey = filterStr || 'ALL';

        if (!filterStr) {
            if (this.selectNullOptionOnEmptyFilter) {
                this.state = LoadingState.idle;
                this.isDropdownVisible = false;
                this.selectOption(null);
                return;
            }
        } 

        const cachedOptions = this.cache.get(cacheKey);

        if (cachedOptions) {
            this.state = LoadingState.idle;
            this.isDropdownVisible = true;
            this.options = cachedOptions;
            return;
        }

        this.state = LoadingState.pending;
        this.isDropdownVisible = true;

        const response : FetcherResponse<Key> = yield this.fetchSuggestions(filterStr);

        if (response) {
            const {suggestions, fromDataStoreCache} = response;

            const options = this.makeOptions(suggestions);
            if (!fromDataStoreCache)
                this.cache.set(cacheKey, options);
            
            this.state = LoadingState.idle;
            this.isDropdownVisible = true;
            this.options = options;
        }
        else {
            this.state = LoadingState.error;
            this.isDropdownVisible = true;
            this.options = [];
        }
    }

    private makeOptions(suggestions: Suggestion<Key>[]) : DropdownOption<Key>[]{
        return suggestions.map(suggestion => ({
            ...suggestion,
            renderElement: () => <>
                <span>{suggestion.text}</span>
            </>
        }))
    }
}