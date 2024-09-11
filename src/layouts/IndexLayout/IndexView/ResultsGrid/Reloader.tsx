import { observer } from "mobx-react-lite";
import { DetailsConstraint as DC, PreviewConstraint as PC} from "../../../../utils/classes/Entity";
import GridStore from "../../../../stores/Grid/GridStore";
import PreviewGridWrapper from "../../../../components/PreviewGrid/PreviewGridWrapper";
import { Button } from "../../../../components/Buttons";

function Reloader<P extends PC, D extends DC>(
    {grid} : {grid: GridStore<P,D>}) {

    return <PreviewGridWrapper type='empty'>

        <div>Failed to fetch {grid.slice.entityName.toLowerCase()}</div>
        
        <Button onClick={() => grid.loadPreviews()}>Try again</Button>

    </PreviewGridWrapper>
};

export default observer(Reloader);