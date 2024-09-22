import { observer } from "mobx-react-lite";
import PreviewsView from "../../../../stores/PreviewsView/PreviewsView";
import Reloader from "./Reloader";
import LoadedResults from "./LoadedResults";
import Entity from "../../../../utils/classes/Entity";

function ResultsGrid<E extends Entity>({view}: {view: PreviewsView<E>}) {

    if (view.isError)
        return <Reloader 
            entityName={view.store.entityName}
            loadPreviews={view.loadPreviews} 
        />

    return <LoadedResults view={view} /> 
}

export default observer(ResultsGrid);