import { observer } from "mobx-react-lite";
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../../../utils/firestoreDbTypes";
import GridStore from "../../../../stores/Grid/GridStore";
import PreviewGridSkeleton from "../../../../components/PreviewGrid/PreviewGridSkeleton";
import Reloader from "./Reloader";

function NotInitialisedGrid<P extends PC, D extends DC>({grid}: {grid: GridStore<P,D>}) {

    const {isError} = grid;

    if (isError)
        return <Reloader grid={grid} />

    return <PreviewGridSkeleton />
}

export default observer(NotInitialisedGrid);