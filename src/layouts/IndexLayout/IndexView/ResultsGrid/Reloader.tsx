import { Button } from "../../../../components/Buttons";
import PreviewGridWrapper from "../../../../components/PreviewGrid/PreviewGridWrapper";

function Reloader(
    {loadPreviews, entityName} : {loadPreviews: () => void, entityName: string}) {

    return <PreviewGridWrapper type='empty'>

        <div>Failed to fetch {entityName.toLowerCase() + 's'}</div>
        
        <Button onClick={loadPreviews}>Try again</Button>

    </PreviewGridWrapper>
};

export default Reloader;