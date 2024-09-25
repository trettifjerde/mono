import { ChangeEvent, MouseEvent } from "react";
import { action, computed, flow, makeObservable, observable } from "mobx";
import { DropdownOption, Suggestion } from "../../utils/uiTypes";
import { LoadingState } from "../../utils/consts";

export type SuggestionsFetcherFn<K extends string> = (filterSt: string) => Promise<Suggestion<K>[] | null>

type FetcherResponse<Key extends string> = Awaited<ReturnType<SuggestionsFetcherFn<Key>>>;

export default class DynamicSelectSettings<Key extends string> {

    //observables
    state: LoadingState = LoadingState.idle;
    filterStr = '';
    isDropdownVisible = false;
    options: DropdownOption<Key>[] = [];
    selectedOption: DropdownOption<Key> | null = null;
    cache: Map<string, DropdownOption<Key>[]> = new Map();
    timer: any = null;
    
    //config
    fetchSuggestions: SuggestionsFetcherFn<Key>;
    onOptionSelect: (option: DropdownOption<Key> | null) => void;
    resetOnSelect: boolean;

    constructor(config: {
        fetchFn: SuggestionsFetcherFn<Key>,
        onSelect: (option: DropdownOption<Key> | null) => void
        resetOnSelect: boolean
    }) {

        this.resetOnSelect = config.resetOnSelect;
        this.fetchSuggestions = config.fetchFn;
        this.onOptionSelect = config.onSelect;

        makeObservable(this, {
            state: observable,
            filterStr: observable,
            isDropdownVisible: observable,
            options: observable,
            selectedOption: observable,
            cache: observable,
            timer: observable,
            isPending: computed,
            isError: computed,
            toggleDropdown: action.bound,
            closeDropdown: action.bound,
            selectOption: action.bound,
            clearSelection: action.bound,
            resetSettings: action.bound,
            startTimer: action.bound,
            filterOptions: flow
        });
    }

    get isPending() {
        return this.state === LoadingState.pending;
    }

    get isError() {
        return this.state === LoadingState.error;
    }

    toggleDropdown(e: MouseEvent<HTMLElement>) {
        if (this.options.length) {
            this.isDropdownVisible = !this.isDropdownVisible;
            e.stopPropagation();
        }
    }

    closeDropdown() {
        this.isDropdownVisible = false;
    }

    selectOption(option: DropdownOption<Key>, forceSelect?: boolean) {
        if (this.resetOnSelect)
            this.resetSettings();

        else {
            this.selectedOption = option;
            this.filterStr = option.text;
            this.options = [];
        }

        if (!forceSelect) 
            this.onOptionSelect(option);
    };

    clearSelection(forceSelect?: boolean) {
        clearTimeout(this.timer);
        this.timer = null;
        this.selectedOption = null;
        this.filterStr = '';
        this.options = [];

        if (!forceSelect)
            this.onOptionSelect(null);
    }

    resetSettings() {
        clearTimeout(this.timer);

        this.state = LoadingState.idle;
        this.filterStr = '';
        this.isDropdownVisible = false;
        this.options = [];
        this.selectedOption = null;
        this.cache = new Map();
        this.timer = null;
    }

    startTimer(e: ChangeEvent<HTMLInputElement>) {
        this.filterStr = e.target.value;

        clearTimeout(this.timer);

        this.timer = setTimeout(() => this.filterOptions(), 350);
    }

    *filterOptions() {

        const cleanFilterStr = this.filterStr.toLowerCase().trim();

        let cacheKey = cleanFilterStr || 'ALL';

        const cachedOptions = this.cache.get(cacheKey);

        if (cachedOptions) {
            this.state = LoadingState.idle;
            this.isDropdownVisible = true;
            this.options = cachedOptions;
            return;
        }

        this.state = LoadingState.pending;
        this.isDropdownVisible = true;

        const suggestions : FetcherResponse<Key> = yield this.fetchSuggestions(cleanFilterStr);

        if (suggestions) {
            const options = this.makeOptions(suggestions);
            
            this.state = LoadingState.idle;
            this.options = options;
            this.cache.set(cacheKey, options);
        }
        else {
            this.state = LoadingState.error;
            this.options = [];
        }
        this.isDropdownVisible = true;
    }

    forceSelect(suggestion: Suggestion<Key> | null) {
        if (suggestion) 
            this.selectOption(this.makeOptions([suggestion])[0], true);
        else
            this.clearSelection(true);
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