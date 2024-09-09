import { observer } from "mobx-react-lite";
import DetailsStore from "../../stores/DetailsStore";
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../utils/classes/Entity";
import { Button } from "../../components/Buttons";

function DetailsReloader<P extends PC, D extends DC>({details}: {details: DetailsStore<P,D>}) {

    return <div>
        <p>Failed to fetch the {details.slice.entityName.toLowerCase()}</p>
        <Button onClick={() => details.prepareItem(details.selectedId)}>Try again</Button>
    </div>
}

export default observer(DetailsReloader);