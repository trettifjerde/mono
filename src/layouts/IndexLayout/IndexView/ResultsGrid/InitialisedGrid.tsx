import { observer } from "mobx-react-lite";
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../../../utils/classes/Entity";
import GridStore from "../../../../stores/Grid/GridStore";
import PreviewGrid from "../../../../components/PreviewGrid";
import LoadMore from "./LoadMore";

function InitialisedGrid<P extends PC, D extends DC>({grid}: {grid: GridStore<P,D>}) {

    const {previews, isFull, ItemPreview} = grid;

    return (
        <PreviewGrid 
            previews={previews} 
            itemName={grid.slice.entityName}
            ItemPreview={ItemPreview}
        >  
            {!isFull && <LoadMore grid={grid} />}
        </PreviewGrid>   
    )
}

export default observer(InitialisedGrid);