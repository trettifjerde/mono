import DataService from "../../services/DataService";
import EntityStore from "../EntityStore";
import GridStore from "../GridStore";
import DetailsStore from "../DetailsStore";
import { PreviewConstraint as PC, DetailsConstraint as DC, EntityConstructor } from "../../utils/classes/Entity";

export default abstract class StoreSlice<P extends PC, D extends DC> {

    abstract entityName: string;
    abstract EntityConstructor: EntityConstructor<P,D>;
    abstract service: DataService<P,D>;
    
    store: EntityStore<P, D>;
    details: DetailsStore<P, D>;
    grid: GridStore<P, D>;

    constructor({rootPath}: {rootPath: string}) {
        this.store = new EntityStore(this);
        this.details = new DetailsStore(this);
        this.grid = new GridStore({slice: this, rootPath});
    }
}