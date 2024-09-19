import { computed, makeObservable } from "mobx";
import { LoadingState } from "../../utils/consts";
import ItemLoaderView from "../ItemLoaderView";

export default abstract class DetailsView<P, D> extends ItemLoaderView<P, D> {
    abstract HeaderComponent: any;

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
}