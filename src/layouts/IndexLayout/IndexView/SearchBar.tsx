import { observer } from "mobx-react-lite";
import GridStore from "../../../stores/Grid/GridStore"
import { DetailsConstraint as DC, PreviewConstraint as PC } from "../../../utils/firestoreDbTypes"
import DebouncedChangeInput from "../../../components/Inputs/DebouncedChangeInput";
import styles from './index.module.scss';

function SearchBar<P extends PC, D extends DC>({grid}: {grid: GridStore<P, D>}) {

    return <div className={styles.search}>
        <label htmlFor="itemSearchBar">
            <i className="icon-search" />
            <span>Search {grid.slice.entityName.toLowerCase() + 's'}</span>
        </label>
        
        <DebouncedChangeInput 
            id="itemSearchBar"
            className={styles.searchinp}
            entityTitleName={grid.entityTitleName}
            applyValue={grid.applyNameFilter}
        />
    </div>
}

export default observer(SearchBar);