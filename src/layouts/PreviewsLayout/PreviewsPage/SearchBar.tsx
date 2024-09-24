import { useRef } from "react";
import { observer } from "mobx-react-lite";
import { getCleanLCValue } from "../../../utils/helpers";
import Entity from "../../../utils/classes/Entity";
import PreviewsView from "../../../stores/PreviewsView/PreviewsView"
import DebouncedInputWithButton from "../../../components/Inputs/DebouncedInputWithButton";
import styles from './index.module.scss';

function SearchBar<E extends Entity>({view}: {view: PreviewsView<E>}) {

    const ref = useRef<HTMLInputElement>(null);

    return <div className={styles.search}>
        <label htmlFor="itemSearchBar">
            <i className="icon-search" />
            <span>Search {view.store.entityName.toLowerCase() + 's'}</span>
        </label>
        
        <DebouncedInputWithButton 
            id="itemSearchBar"
            ref={ref}
            className={styles.searchinp}
            defaultValue={view.nameFilter}
            placeholderWord={view.entityTitleName}
            onChange={(e) => view.setNameFilter(getCleanLCValue(e.target))}
            onBtnClick={() => {
                view.setNameFilter('');
                if (ref.current)
                    ref.current.value = '';
            }}
        />
    </div>
}

export default observer(SearchBar);