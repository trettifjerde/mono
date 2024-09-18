import { observer } from "mobx-react-lite";
import PreviewsView from "../../../stores/previews/PreviewsView"
import DebouncedChangeInput from "../../../components/Inputs/DebouncedChangeInput";
import styles from './index.module.scss';

function SearchBar<P, D>({view}: {view: PreviewsView<P, D>}) {

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