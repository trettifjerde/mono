import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import GridStore from "../../../stores/Grid/GridStore";
import { DetailsConstraint as DC, PreviewConstraint as PC } from '../../../utils/firestoreDbTypes';
import SearchBar from "./SearchBar";
import Select from "../../../components/Select";
import ResultsGrid from "./ResultsGrid";
import styles from './index.module.scss';

function IndexView<P extends PC, D extends DC>({grid, children}: {
    grid: GridStore<P, D>,
    children?: ReactNode
}) {

    const {isStoreNotInitialised, loadPreviews} = grid;

    if (isStoreNotInitialised)
        loadPreviews();

    return <>
        <div className={styles.panel}>
            <SearchBar grid={grid} className={styles.search}/>

            <Select config={grid.sortSettings} selectOption={grid.selectSortType}/>
            
            {children}
        </div>

        <ResultsGrid grid={grid} />
    </>
}

export default observer(IndexView);