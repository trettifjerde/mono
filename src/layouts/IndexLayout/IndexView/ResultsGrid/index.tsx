import { observer } from "mobx-react-lite";
import PreviewsView from "../../../../stores/previews/PreviewsView";
import PreviewGridSkeleton from "../../../../components/PreviewGrid/PreviewGridSkeleton";
import Reloader from "./Reloader";
import LoadedResults from "./LoadedResults";
import styles from './index.module.scss';

function ResultsGrid<P, D>({view}: {view: PreviewsView<P, D>}) {
    const { isError, isLoading, loadPreviews } = view;

    const renderGrid = () => {
        
        if (isError) 
            return <Reloader 
                entityName={view.store.entityName}
                loadPreviews={loadPreviews} 
            />

        if (isLoading)
            return <PreviewGridSkeleton /> 

        return <LoadedResults view={view} /> 
    }

    return <div className={styles.grid}>
        {renderGrid()}
    </div>
}

export default observer(ResultsGrid);