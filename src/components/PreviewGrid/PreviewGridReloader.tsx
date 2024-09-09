import { observer } from "mobx-react-lite";
import PreviewGridWrapper from "./PreviewGridWrapper";
import { Button } from "../Buttons";
import { DetailsConstraint, PreviewConstraint } from "../../utils/classes/Entity";
import GridStore from "../../stores/GridStore";

function PreviewGridReloader<P extends PreviewConstraint, D extends DetailsConstraint>(
    {grid} : {grid: GridStore<P,D>}) {

    return <PreviewGridWrapper type='empty'>

        <div>Failed to fetch {grid.slice.entityName.toLowerCase()}</div>
        
        <Button onClick={() => grid.fetchPreviews()}>Try again</Button>

    </PreviewGridWrapper>
};

export default observer(PreviewGridReloader);