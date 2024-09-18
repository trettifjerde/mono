import { observer } from "mobx-react-lite";
import { DetailsConstraint as DC, PreviewConstraint as PC } from "../../../utils/firestoreDbTypes"
import PreviewsView from "../../../stores/previews/PreviewsView"
import DebouncedChangeInput from "../../../components/Inputs/DebouncedChangeInput";
import styles from './index.module.scss';

function SearchBar<P extends PC, D extends DC>({view}: {view: PreviewsView<P, D>}) {

    return <div className={styles.search}>
        <label htmlFor="itemSearchBar">
            <i className="icon-search" />
            <span>Search {view.store.entityName.toLowerCase() + 's'}</span>
        </label>
        
        <DebouncedChangeInput 
            id="itemSearchBar"
            className={styles.searchinp}
            entityTitleName={view.entityTitleName}
            applyValue={view.setNameFilter}
        />
    </div>
}

export default observer(SearchBar);