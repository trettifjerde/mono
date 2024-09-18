import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { DetailsConstraint as DC, PreviewConstraint as PC } from '../../../utils/firestoreDbTypes';
import PreviewsView from "../../../stores/previews/PreviewsView";
import Select from "../../../components/Select";
import SearchBar from "./SearchBar";
import ResultsGrid from "./ResultsGrid";
import styles from './index.module.scss';

function IndexView<P extends PC, D extends DC>({view, children}: {
    view: PreviewsView<P, D>,
    children?: ReactNode
}) {

    const {initialiseView} = view;

    initialiseView();

    return <>
        <div className={styles.panel}>
            <SearchBar view={view}/>

            <Select 
                sortSettings={view.sortSettings}
                id="sortSelect"
                label="Sort by"
                icon="icon-arrows-v"
                placeholder="Select type"
            />
            
            {children}
        </div>

        <ResultsGrid view={view} />
    </>
}

export default observer(IndexView);