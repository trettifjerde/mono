import { observer } from "mobx-react-lite";
import { Button } from "../../components/Buttons";
import DetailsView from "../../stores/details/DetailsView";

function DetailsReloader<P, D>({view}: {view: DetailsView<P, D>}) {

    return <div style={{textAlign: 'center'}}>
        <p>Failed to fetch the {view.store.entityName.toLowerCase()}</p>
        <Button 
            onClick={() => view.prepareItem()}
        >
            Try again
        </Button>
    </div>
}

export default observer(DetailsReloader);