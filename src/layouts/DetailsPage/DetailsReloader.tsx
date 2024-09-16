import { observer } from "mobx-react-lite";
import DetailsView from "../../stores/details/DetailsView";
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../utils/firestoreDbTypes";
import { Button } from "../../components/Buttons";

function DetailsReloader<P extends PC, D extends DC>({details}: {details: DetailsView<P,D>}) {

    return <div style={{textAlign: 'center'}}>
        <p>Failed to fetch the {details.slice.entityName.toLowerCase()}</p>
        <Button 
            onClick={() => details.prepareItem()}
        >
            Try again
        </Button>
    </div>
}

export default observer(DetailsReloader);