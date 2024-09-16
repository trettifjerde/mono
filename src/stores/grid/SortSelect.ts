import { action, makeObservable, observable } from "mobx";
import { PreviewConstraint as PC } from "../../utils/firestoreDbTypes";
import { DropdownOption } from "../../utils/uiTypes";

export default class SortSelect<P extends PC, Key=any> {
    config: SortConfig<P, Key>;
    options: DropdownOption<Key>[];
    selectedOption: DropdownOption<Key> | null;

    constructor(config: SortConfig<P, Key>){
        this.config = config;
        this.options = this.initialiseOptions();
        this.selectedOption = null;

        makeObservable(this, {
            options: observable,
            selectedOption: observable,
            selectType: action.bound
        })
    }

    getSelectedType() {
        return this.selectedOption && (this.config.get(this.selectedOption.value) || null);
    }

    selectType(option: SortSelect<P, Key>['selectedOption']) {
        this.selectedOption = option;
    };

    protected initialiseOptions() {
        const options : SortSelect<P, Key>['options'] = [];
        for (const [sortType, info] of this.config)
            options.push({ value: sortType, text: info.text, icon: `icon-slim-arrow-${info.desc ? 'down' : 'up'}` });

        return options;
    }
}

export type SortConfig<P extends PC, Key> = Map<Key, {
    dbKey: keyof P, 
    text: string,
    desc?: 'desc'
}>