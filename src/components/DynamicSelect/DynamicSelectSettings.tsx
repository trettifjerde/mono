import { action, computed, flow, makeObservable, observable } from "mobx";
import { DropdownOption, Suggestion } from "../../utils/uiTypes";
import { LoadingState } from "../../utils/consts";

export type SuggestionsFetcherFn<K extends string> = (filterSt: string) => Promise<{
    suggestions: Suggestion<K>[],
    fromCache: boolean
 } | null>

export default class DynamicSelectSettings<Key extends string> {

    state: LoadingState = LoadingState.idle;
    isDropdownVisible = false;
    options: DropdownOption<Key>[] = [];
    cache: Map<string, DropdownOption<Key>[]> = new Map();
    selectedOption: DropdownOption<Key> | null = null;

    constructor(public fetchSuggestions: SuggestionsFetcherFn<Key>, public queryEmptyString=false){

        makeObservable(this, {
            state: observable,
            cache: observable,
            options: observable,
            isDropdownVisible: observable,
            selectedOption: observable,
            isLoading: computed,
            isError: computed,
            selectedType: computed,
            openDropdown: action.bound,
            toggleDropdown: action.bound,
            selectOption: action.bound,
            clearCache: action,
            updateFilterStr: flow.bound,
        });
    }

    get isLoading() {
        return this.state === LoadingState.loading;
    }

    get isError() {
        return this.state === LoadingState.error;
    }

    get selectedType() {
        return this.selectedOption && (this.selectedOption.value || null);
    }

    *updateFilterStr(filterStr: string) {

        if (!filterStr) {
            if(!this.queryEmptyString) {
                this.options = [];
                this.isDropdownVisible = false;
                this.selectedOption = null;
                return;
            }
            else {
                filterStr = 'ALL';
            }
        }

        const cachedOptions = this.cache.get(filterStr);

        if (cachedOptions) {
            this.options = cachedOptions;
            this.isDropdownVisible = true;
            return;
        }

        this.state = LoadingState.loading;
        this.isDropdownVisible = true;

        const response : Awaited<ReturnType<SuggestionsFetcherFn<Key>>> = yield this.fetchSuggestions(filterStr);

        if (response) {
            const {suggestions, fromCache} = response;

            const options = this.makeOptions(suggestions);
            if (!fromCache)
                this.cache.set(filterStr, options);
            
            this.options = options;
            this.state = LoadingState.idle;
        }
        else {
            this.state = LoadingState.error;
            this.options = [];
        }
        this.isDropdownVisible = true;
    }

    openDropdown() {
        if (this.options.length || this.queryEmptyString) 
            this.isDropdownVisible = true;
    }

    toggleDropdown(flag: boolean) {
        this.isDropdownVisible = flag;
    }

    selectOption(option: typeof this.selectedOption) {
        this.selectedOption = option;
        this.options = [];
    };

    clearCache() {
        this.cache = new Map();
    }

    makeOptions(suggestions: Suggestion<Key>[]) : DropdownOption<Key>[]{
        return suggestions.map(s => ({
            ...s,
            renderElement: () => <>
                <span>{s.text}</span>
            </>
        }))
    }
}