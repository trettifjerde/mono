import { observer } from "mobx-react-lite";
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../utils/firestoreDbTypes";
import { Button } from "../../components/Buttons";
import DetailsView from "../../stores/details/DetailsView";

function DetailsReloader<P extends PC, D extends DC>({view}: {view: DetailsView<P,D>}) {

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