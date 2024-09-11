import DataService from "../../services/DataService";
import EntityStore from "../EntityStore";
import DetailsStore from "../DetailsStore";
import { PreviewConstraint as PC, DetailsConstraint as DC, EntityConstructor } from "../../utils/classes/Entity";
import GridStore from "../Grid/GridStore";

export default abstract class StoreSlice<P extends PC, D extends DC> {

    abstract entityName: string;
    abstract EntityConstructor: EntityConstructor<P,D>;
    abstract service: DataService<P,D>;
    abstract grid: GridStore<P, D>;
    
    store: EntityStore<P, D>;
    details: DetailsStore<P, D>;

    constructor() {
        this.store = new EntityStore(this);
        this.details = new DetailsStore(this);
    }
}