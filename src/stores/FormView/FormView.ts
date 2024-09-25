import { flow, makeObservable } from "mobx";
import { LoadingState } from "../../utils/consts";
import ItemLoader from "../ItemLoader";
import Entity from "../../utils/classes/Entity";
import DataStore from "../DataStore/DataStore";
import CustomForm from "./forms/CustomForm";

export default class FormView<
    E extends Entity=any, 
    F extends CustomForm<E>=CustomForm<any>
> extends ItemLoader<E> {

    override store: DataStore<E>;
    form: F;

    constructor(store: DataStore<E>, ItemForm: new (view: FormView<E, F>) => F) {
        super();

        this.store = store;
        this.form = new ItemForm(this);

        makeObservable(this, {
            submit: flow.bound
        });
    }

    override setEmptyItem() {
        super.setEmptyItem();
        this.form.updateFields(null);
    }

    override setLoadedItem(item: E) {
        super.setLoadedItem(item);
        this.form.updateFields(item);
    }

    *submit(formData: Record<string, any>) {

        this.form.validationError = null;
        this.state = LoadingState.pending;

        try {
            const authorId : string = yield this.loadedItem ?
                this.store.updateItem(this.loadedItem, formData) :
                this.store.postItem(formData)

            this.redirectToId(authorId);
            this.state = LoadingState.idle;
        }
        catch (error) {
            console.log(error);
            this.state = LoadingState.error;
        }
    }
}