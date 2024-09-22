import { observer } from "mobx-react-lite";
import { getCleanLCValue } from "../../../utils/helpers";
import PreviewsView from "../../../stores/PreviewsView/PreviewsView"
import DebouncedInputWithButton from "../../../components/Inputs/DebouncedInputWithButton";
import styles from './index.module.scss';
import { useRef } from "react";
import Entity from "../../../utils/classes/Entity";

function SearchBar<E extends Entity>({view}: {view: PreviewsView<E>}) {

    const ref = useRef<HTMLInputElement>(null);

    return <div className={styles.search}>
        <label htmlFor="itemSearchBar">
            <i className="icon-search" />
            <span>Search {view.store.entityName.toLowerCase() + 's'}</span>
        </label>
        
        <DebouncedInputWithButton 
            ref={ref}
            id="itemSearchBar"
            className={styles.searchinp}
            defaultValue={view.nameFilter}
            entityTitleName={view.entityTitleName}
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