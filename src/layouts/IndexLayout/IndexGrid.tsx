import { observer } from "mobx-react-lite";
import GridStore from "../../stores/GridStore";
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../utils/classes/Entity";
import { EntityPreviewComponent } from "../../utils/uiTypes";
import { LoadingState } from "../../utils/consts";
import PreviewGridList from "../../components/PreviewGrid";
import PreviewGridReloader from "../../components/PreviewGrid/PreviewGridReloader";
import PreviewGridSkeleton from "../../components/PreviewGrid/PreviewGridSkeleton";

function IndexGrid<P extends PC, D extends DC>({grid, ItemPreview}: {
    grid: GridStore<P, D>,
    ItemPreview: EntityPreviewComponent<P,D>
}) {

    const {state, previews, fetchPreviews} = grid;

    switch (state) {
        case LoadingState.notInitialised:
            fetchPreviews();
            return <PreviewGridSkeleton />

        case LoadingState.error:
            return <PreviewGridReloader grid={grid} />

        case LoadingState.idle:
            return <PreviewGridList 
                previews={previews} 
                itemName={grid.slice.entityName}
                ItemPreview={ItemPreview}
            />     

        default:
            return <PreviewGridSkeleton />   
    }
}

export default observer(IndexGrid);