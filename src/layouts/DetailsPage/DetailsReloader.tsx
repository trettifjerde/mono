import { observer } from "mobx-react-lite";
import { Button } from "../../components/Buttons";
import DetailsView from "../../stores/DetailsView/DetailsView";

function DetailsReloader({view}: {view: DetailsView}) {

    return <div style={{textAlign: 'center'}}>
        <p>Failed to fetch the {view.store.entityName.toLowerCase()}</p>

        <Button color="dark" onClick={() => view.reloadItem()}>
            Try again
        </Button>
    </div>
}

export default observer(DetailsReloader);