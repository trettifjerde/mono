import { action, flow, makeObservable, reaction } from "mobx";
import { LoadingState } from "../../utils/consts";
import ItemLoader from "../ItemLoader";
import DefaultBookImgSrc from '../../assets/800x800.webp';
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
        super(DefaultBookImgSrc);

        this.store = store;
        this.form = new ItemForm(this);

        makeObservable(this, {
            reset: action,
            submit: flow.bound,
        });

        reaction(
            () => ({
                initing: this.isInitialising, 
                item: this.loadedItem
            }),
            ({initing, item}) => {
                // if new item has finished loading
                if (!initing && item)
                    this.form.updateFields(item);
            }
        )
    }

    *submit(formData: Record<string, any>) {

        this.form.validationError = null;
        this.state = LoadingState.pending;

        try {
            const authorId : string = yield this.loadedItem ?
                this.store.updateItem(this.loadedItem, formData) :
                this.store.postItem(formData)

            this.setRedirectPath(authorId);
            this.state = LoadingState.idle;
        }
        catch (error) {
            console.log(error);
            this.state = LoadingState.error;
        }
    }

    reset() {
        this.setRedirectPath(null);
        this.form.updateFields(null);
    }
}