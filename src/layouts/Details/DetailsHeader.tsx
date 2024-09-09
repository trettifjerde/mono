import { ReactNode } from "react"
import { observer } from "mobx-react-lite"
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../utils/classes/Entity";
import DetailsStore from "../../stores/DetailsStore";

function DetailsHeader<P extends PC, D extends DC>({details, children}: {
    details: DetailsStore<P,D>,
    children?: ReactNode
}) {
    const {isFailure, isLoading, loadedItem: item} = details;

    return <header>
        <hgroup>
            <h1>{(isFailure && 'Oops!') || (!isLoading && item?.preview.name)}</h1>
            {children}
        </hgroup>        
    </header>
}

export default observer(DetailsHeader);