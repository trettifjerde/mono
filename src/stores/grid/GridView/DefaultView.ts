import GridStore from "../GridStore";
import { GridView } from "./GridView";
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../../../utils/firestoreDbTypes';

export default class DefaultView<P extends PC, D extends DC> extends GridView<P, D> {

    constructor(gridStore: GridStore<P,D>) {
        super(gridStore);
    }
}