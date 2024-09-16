import { observer } from "mobx-react-lite";
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../../../utils/firestoreDbTypes";
import GridStore from "../../../../stores/grid/GridStore";
import PreviewGridSkeleton from "../../../../components/PreviewGrid/PreviewGridSkeleton";
import Reloader from "./Reloader";
import PreviewGrid from "../../../../components/PreviewGrid";
import PagButton from "./PagButton";
import styles from './index.module.scss';

function ResultsGrid<P extends PC, D extends DC>({grid}: {grid: GridStore<P, D>}) {

    const {entityName} = grid.slice;
    const { currentView, loadPreviews, ItemPreview } = grid;
    const { isError, isLoading } = currentView;

    const renderGrid = () => {
        
        if (isError) 
            return <Reloader 
                entityName={entityName}
                loadPreviews={loadPreviews} 
            />

        if (isLoading)
            return <PreviewGridSkeleton /> 

        return <PreviewGrid 
                previews={currentView.currentPagePreviews} 
                itemName={entityName}
                ItemPreview={ItemPreview}
            >  
            
            <div className={styles.pag}>
                <PagButton 
                    icon="icon-arrow-left" 
                    isVisible={currentView.isPrevBtnVisible}
                    onClick={currentView.showPrev}
                />
                <PagButton 
                    icon="icon-arrow-right" 
                    isVisible={currentView.isNextBtnVisible}
                    onClick={currentView.showNext}
                />
            </div>
        </PreviewGrid>  
    }

    return <div className={styles.grid}>
        {renderGrid()}
    </div>
}

export default observer(ResultsGrid);