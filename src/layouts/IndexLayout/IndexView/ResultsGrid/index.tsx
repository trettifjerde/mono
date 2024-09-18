import { observer } from "mobx-react-lite";
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../../../utils/firestoreDbTypes";
import PreviewsView from "../../../../stores/previews/PreviewsView";
import PreviewGridSkeleton from "../../../../components/PreviewGrid/PreviewGridSkeleton";
import Reloader from "./Reloader";
import LoadedResults from "./LoadedResults";
import styles from './index.module.scss';

function ResultsGrid<P extends PC, D extends DC>({view}: {view: PreviewsView<P, D>}) {
    const { isError, isLoading, loadPreviews } = view;

    console.log('results grid', isError, isLoading)

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