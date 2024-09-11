import { observer } from "mobx-react-lite";
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../../../utils/classes/Entity";
import GridStore from "../../../../stores/Grid/GridStore";
import NotInitialisedGrid from "./NotInitialisedGrid";
import InitialisedGrid from "./InitialisedGrid";
import styles from './index.module.scss';

function ResultsGrid<P extends PC, D extends DC>({grid}: {grid: GridStore<P, D>}) {

    const {isNotInitialised} = grid

    return <div className={styles.grid}>
        {isNotInitialised ? 
            <NotInitialisedGrid grid={grid} /> : 
            <InitialisedGrid grid={grid} />
        }
    </div>
}

export default observer(ResultsGrid);