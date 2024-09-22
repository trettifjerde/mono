import { action, computed, makeObservable, observable } from "mobx";
import { FilterConfig, FirestoreQueryParams } from "../../../utils/dataTypes";
import Entity from "../../../utils/classes/Entity";

export default class FilterSettings<Keys extends string, E extends Entity=any> {

    config: FilterConfig<Keys, E>;
    
    filters = new Map<Keys, any>();

    constructor(filterConfig: FilterConfig<Keys, E>) {
        this.config = filterConfig;
        this.initialiseFilters();

        makeObservable(this, {
            filters: observable,
            allFilterValues: computed,
            setFilter: action.bound,
            setToDefault: action
        })
    }

    get allFilterValues() {
        return Array.from(this.filters.values());
    }

    setFilter(type: Keys, value: string | boolean) {
        this.filters.set(type, value);
    }

    castToFirestoreParams() {
        const filters : FirestoreQueryParams<E>['filters'] = [];
        const sorts: FirestoreQueryParams<E>['sorts'] = [];

        this.filters.forEach((selectedValue, filterType) => {

            if (selectedValue) {
                const cons = this.config[filterType].makeConstraints(selectedValue);
                filters.push(...cons.filters);
                sorts.push(cons.sort)
            }

        });

        return {filters, sorts};
    }

    castToFilterFn() : (ent: E) => boolean {
        const filterFns : Array<(ent: E) => boolean> = [];

        this.filters.forEach((selectedValue, filterType) => {
            if (selectedValue) 
                filterFns.push(this.config[filterType].makeFilterFn(selectedValue))
        })

        return (ent) => filterFns.reduce((acc, v) => acc && v(ent), true);
    }

    setToDefault() {
        this.initialiseFilters();
    }

    private initialiseFilters() {
        for (const filterType in this.config) 
            this.filters.set(filterType, this.config[filterType].initialValue)
    }
}