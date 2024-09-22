import { computed, makeObservable } from "mobx";
import { LoadingState } from "../../utils/consts";
import ItemLoader from "../ItemLoader";
import Entity from "../../utils/classes/Entity";

export default abstract class DetailsView<E extends Entity> extends ItemLoader<E> {
    abstract HeaderComponent: ((props: {item: E | null}) => JSX.Element) | null;

    constructor(fallbackImg: string) {
        super(fallbackImg);

        makeObservable(this, {
            headerContent: computed
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

    deleteItem() {
        
    }
}