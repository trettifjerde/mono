import { observer } from "mobx-react-lite";
import { Button } from "../../components/Buttons";
import Entity from "../../utils/classes/Entity";
import DetailsView from "../../stores/DetailsView/DetailsView";

function DetailsReloader<E extends Entity>({view}: {view: DetailsView<E>}) {

    return <div style={{textAlign: 'center'}}>
        <p>Failed to fetch the {view.store.entityName.toLowerCase()}</p>
        <Button 
            onClick={view.reloadItem}
        >
            Try again
        </Button>
    </div>
}

export default observer(DetailsReloader);