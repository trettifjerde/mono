import DataService from "../../services/DataService";
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../utils/firestoreDbTypes";
import { EntityConstructor } from "../../utils/classes/Entity";
import DataStore from "../DataStore";
import GridStore from "../grid/GridStore";
import DetailsView from "../details/DetailsView";
import RootStore from "../RootStore";

export default abstract class StoreSlice<P extends PC, D extends DC> {

    rootStore: RootStore;
    dataStore: DataStore<P, D>;
    abstract entityName: string;
    abstract EntityConstructor: EntityConstructor<P,D>;
    abstract service: DataService<P,D>;
    abstract grid: GridStore<P, D>;
    abstract details: DetailsView<P, D>;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        this.dataStore = new DataStore(this);
    }
}