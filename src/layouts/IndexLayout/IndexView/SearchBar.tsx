import { observer } from "mobx-react-lite";
import GridStore from "../../../stores/Grid/GridStore"
import { DetailsConstraint as DC, PreviewConstraint as PC } from "../../../utils/firestoreDbTypes"
import DebouncedChangeInput from "../../../components/Inputs/DebouncedChangeInput";

function SearchBar<P extends PC, D extends DC>({grid, className}: {
    grid: GridStore<P, D>
    className: string
}) {

    return <div className={className}>
        <label htmlFor="itemSearchBar">
            Search {grid.slice.entityName.toLowerCase() + 's'}
        </label>
        
        <DebouncedChangeInput 
            id="itemSearchBar"
            entityTitleName={grid.entityTitleName}
            applyValue={grid.applyNameFilter}
        />
    </div>
}

export default observer(SearchBar);