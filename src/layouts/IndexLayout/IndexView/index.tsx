import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import GridStore from "../../../stores/Grid/GridStore";
import { DetailsConstraint as DC, PreviewConstraint as PC } from '../../../utils/classes/Entity';
import SearchBar from "./SearchBar";
import ResultsGrid from "./ResultsGrid";
import { ItemSorting } from "./ItemSorting";
import styles from './index.module.scss';

function IndexView<P extends PC, D extends DC>({grid, children}: {
    grid: GridStore<P, D>,
    children?: ReactNode
}) {

    return <>
        <div className={styles.panel}>
            <SearchBar grid={grid} className={styles.search}/>

            <ItemSorting grid={grid} />
            
            {children}
        </div>

        <ResultsGrid grid={grid} />
    </>
}

export default observer(IndexView);