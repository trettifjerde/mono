import { action, computed, makeObservable, observable } from "mobx";
import { FirestoreKeys as FK} from "../../../utils/firestoreDbTypes";
import { FirestoreQueryParams, SortConfig } from "../../../utils/dataTypes";
import { DropdownOption } from "../../../utils/uiTypes";
import Entity from "../../../utils/classes/Entity";

export default class SortSettings<Key extends string, P> {
    config: SortConfig<Key, P>;
    options: DropdownOption<Key>[];
    selectedOption: DropdownOption<Key> | null;

    constructor(config: SortConfig<Key, P>){
        this.config = config;
        this.options = this.initialiseOptions();
        this.selectedOption = null;

        makeObservable(this, {
            options: observable,
            selectedOption: observable,
            selectedType: computed,
            selectOption: action.bound
        })
    }

    get selectedType() {
        return this.selectedOption && (this.selectedOption.value || null);
    }

    selectOption(option: typeof this.options[0] | null) {
        this.selectedOption = option;
    };

    castToFirestoreParams() : FirestoreQueryParams<P>['sorts'] {
        if (this.selectedType) {
            const {field, desc} = this.config[this.selectedType];
            return [{field, desc}];
        }
        else 
            return [];
    }
    
    castToSortFn() : (a: Entity<P, any>, b: Entity<P, any>) => number {
        if (this.selectedType) {
            const {field, desc} = this.config[this.selectedType];

            if (desc)
                return (a, b) => a.previewInfo[field] > b.previewInfo[field] ? -1 : 1;

            return (a, b) => a.previewInfo[field] < b.previewInfo[field] ? -1 : 1;
        }
        return (a, b) => a.previewInfo[FK.name_lowercase] < b.previewInfo[FK.name_lowercase] ? -1 : 1;
    }

    private initialiseOptions() {
        const options : typeof this.options = [];
        
        for (const sortType in this.config)
            options.push({ 
                value: sortType, 
                text: this.config[sortType].text,
                element: <>
                    <span>{this.config[sortType].text}</span>
                    <i className={`icon-slim-arrow-${this.config[sortType].desc ? 'down' : 'up'}`} />
                </> 
        });

        return options;
    }
}