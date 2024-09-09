import { observer } from "mobx-react-lite"
import DetailsStore from "../../stores/DetailsStore";
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../utils/classes/Entity";

function DetailsImage<P extends PC, D extends DC>({details, fallbackImg, errorClassName}: {
    details: DetailsStore<P,D>,
    fallbackImg: string, 
    errorClassName: string
}) {

    const {loadedItem, isFailure } = details;

    return <figure className={isFailure ? errorClassName : ''}>
        <img src={loadedItem?.preview.img || fallbackImg} alt="Decorative image" />
    </figure>
}

export default observer(DetailsImage);