import { action, computed, makeObservable, observable } from "mobx";
import { WhereFilterOp } from "firebase/firestore/lite";
import { FirestoreQueryParams } from "../../../utils/dataTypes";
import Entity from "../../../utils/classes/Entity";

export default class FilterSettings<Keys extends string, P> {

    config: FilterConfig<Keys, P>;
    filters = new Map<Keys, string | boolean>();

    constructor(filterConfig: FilterConfig<Keys, P>) {
        this.config = filterConfig;
        this.initialiseFilters();

        makeObservable(this, {
            filters: observable,
            allFilterValues: computed,
            setFilter: action.bound
        })
    }

    get allFilterValues() {
        return Array.from(this.filters.values());
    }

    setFilter(type: Keys, value: string | boolean) {
        this.filters.set(type, value);
    }

    castToFirestoreParams() {
        const filters : FirestoreQueryParams<P>['filters'] = [];
        const sorts: FirestoreQueryParams<P>['sorts'] = [];

        for (const filterType in this.config) {
            const value = this.filters.get(filterType);

            if (value) {

                const {field, constraints, desc} = this.config[filterType];

                sorts.push({field, desc});
                
                for (const constr of constraints) {
                    const {op, makeValue} = constr;
                    filters.push({field, op, value: makeValue(value)})
                }
            }
        }
        return {filters, sorts};
    }

    castToFilterFn() : (ent: Entity<P, any>) => boolean {
        const filterFns : Array<(ent: Entity<P, any>) => boolean> = [];

        for (const filterType in this.config) {
            const enteredValue = this.filters.get(filterType);

            if (enteredValue) {
                const {field, constraints} = this.config[filterType];

                for (const constr of constraints) {
                    const {op, makeValue} = constr;
                    const filterValue = makeValue(enteredValue);

                    switch (op) {
                        case '==':
                            filterFns.push(a => a.previewInfo[field] === filterValue);
                            break;

                        case '>':
                            filterFns.push(a => a.previewInfo[field] > filterValue);
                            break;
                        
                        case '>=':
                            filterFns.push(a => a.previewInfo[field] >= filterValue);
                            break;

                        case '<=':
                            filterFns.push(a => a.previewInfo[field] <= filterValue);
                            break;
                    }
                }
            }
        }

        return (ent) => filterFns.reduce((acc, v) => acc && v(ent), true);
    }

    private initialiseFilters() {
        for (const filterType in this.config) 
            this.filters.set(filterType, this.config[filterType].initialValue)
    }
}

export type FilterConfig<Keys extends string, P> = Record<Keys, {
    field: keyof Entity<P, any>['previewInfo'],
    initialValue: any,
    desc?: 'desc',
    constraints: Array<
    {
        op: WhereFilterOp, 
        makeValue(v: any) : string | number
    }>
}>;