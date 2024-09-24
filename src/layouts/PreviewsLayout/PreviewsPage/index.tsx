import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { Pathnames } from "../../../utils/consts";
import { makeAbsolutePath } from "../../../utils/helpers";
import { LinkButton } from "../../../components/Buttons";
import Entity from "../../../utils/classes/Entity";
import PreviewsView from "../../../stores/PreviewsView/PreviewsView";
import SortSelect from "./SortSelect";
import SearchBar from "./SearchBar";
import ResultsGrid from "./ResultsGrid";
import styles from './index.module.scss';

function PreviewsPage<E extends Entity>({view, children}: {
    view: PreviewsView<E>,
    children?: ReactNode
}) {

    view.initialiseView();

    return <>
        <div className={styles.cont}>
            <div className={styles.panel}>
                <SearchBar view={view}/>

                <SortSelect 
                    sortSettings={view.sortSettings}
                    id="sortSelect"
                    label="Sort by"
                    icon="icon-arrows-v"
                    placeholder="Select type"
                />
                
                {children}

                <div className={styles.addBtn}>
                    <LinkButton 
                        to={makeAbsolutePath(view.store.pathname, Pathnames.new)}
                        color="dark"
                    >
                        <i className="icon-plus" />
                        <span>Add new {view.store.entityName.toLowerCase()}</span>
                    </LinkButton>
                </div>
            </div>
        </div>

        <ResultsGrid view={view} />
    </>
}

export default observer(PreviewsPage);