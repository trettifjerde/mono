import { observer } from "mobx-react-lite";
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../../../utils/firestoreDbTypes";
import GridStore from "../../../../stores/Grid/GridStore";
import PreviewGrid from "../../../../components/PreviewGrid";
import LoadMore from "./LoadMore";

function InitialisedGrid<P extends PC, D extends DC>({grid}: {grid: GridStore<P,D>}) {

    const {currentView, ItemPreview, loadPreviews} = grid;
    const {previews, isFull, isLoading} = currentView;

    return (
        <PreviewGrid 
            previews={previews} 
            itemName={grid.slice.entityName}
            ItemPreview={ItemPreview}
        >  
        
            {!isFull && <LoadMore 
                isLoading={isLoading} 
                loadPreviews={loadPreviews} 
            />}
        </PreviewGrid>   
    )
}

export default observer(InitialisedGrid);