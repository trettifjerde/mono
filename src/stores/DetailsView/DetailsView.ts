import { computed, flow, makeObservable, observable } from "mobx";
import { LoadingState } from "../../utils/consts";
import ItemLoader from "../ItemLoader";
import Entity from "../../utils/classes/Entity";

export default abstract class DetailsView<E extends Entity=any> extends ItemLoader<E> {
    deleteErrorMessage : string | null = null;
    abstract HeaderComponent: ((props: {item: E | null}) => JSX.Element) | null;

    constructor() {
        super();

        makeObservable(this, {
            deleteErrorMessage: observable,
            headerContent: computed,
            deleteItem: flow.bound,
        })
    }

    get headerContent() {
        switch (this.state) {
            case LoadingState.error:
            case LoadingState.notFound:
                return 'Oops';

            default:
                return this.loadedItem?.preview.name || '';
        }
    }

    *deleteItem(item: E) {
        this.state = LoadingState.pending;

        try {
            yield this.store.deleteItem(item);
            this.state = LoadingState.idle;
            this.redirectToRoot();
        }
        catch(error) {
            console.log(error);
            this.deleteErrorMessage = 'Delete request failed. Try again later';
            this.state = LoadingState.idle;
        }
    }
}