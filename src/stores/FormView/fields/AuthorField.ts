import { action, computed, makeObservable } from "mobx";
import { Field } from "mobx-react-form";
import { FieldConstructor } from "mobx-react-form/lib/models/FieldInterface";
import { DropdownOption } from "../../../utils/uiTypes";
import { BookAuthorInfo } from "../../../utils/classes/Book";
import BookForm from "../forms/BookForm";
import DynamicSelectSettings from "../../../components/DynamicSelect/DynamicSelectSettings";

export default class AuthorField extends Field {

    removeConfirmVisible = false;
    authorSettings: DynamicSelectSettings<string>;

    constructor(props : FieldConstructor) {
        super(props);

        this.authorSettings = new DynamicSelectSettings<string>({
            fetchFn: this.fetchAuthorSuggestions.bind(this),
            onSelect: this.setAuthor.bind(this),
            resetOnSelect: false
        });

        makeObservable(this, {
            view: computed,
            setAuthor: action.bound,
            confirmRemoval: action.bound
        });
    }

    get view() {
        return (this.state.form as BookForm).view;
    }

    override reset() {
        super.reset();
        
        const authorInfo : BookAuthorInfo | null = this.default;
        
        if (authorInfo) 
            this.authorSettings.forceSelect({
                text: authorInfo.name, 
                value: authorInfo.id
            });
        
        else
            this.authorSettings.forceSelect(null);
    }

    confirmRemoval() {
        this.removeConfirmVisible = true;
    }

    setAuthor(option: DropdownOption<string> | null) {
        this.set(option ? {name: option.text, id: option.value} : this.initial);
    }

    fetchAuthorSuggestions(nameStart: string) {
        return this.view.store.rootStore.authors.getAuthorSuggestionsByName(nameStart);
    }
}