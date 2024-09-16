import { observer } from "mobx-react-lite"
import DetailsView from "../../stores/details/DetailsView"
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../../utils/firestoreDbTypes'
import { splitAndWrapInPs } from "../../utils/helpers"
import DetailsReloader from "./DetailsReloader"
import { LinkButton } from "../../components/Buttons"

function DetailsMain<P extends PC, D extends DC>({ details }: { details: DetailsView<P, D> }) {

    const renderDescription = () => {

        if (details.isError)
            return <DetailsReloader details={details} />

        if (details.isNotFound)
            return (
                <div style={{ textAlign: 'center' }}>
                    <p>{details.slice.entityName} not found</p>

                    <LinkButton
                        className="link-center"
                        to={details.slice.grid.rootPath}
                        relative="path"
                    >
                        Browse other {details.slice.entityName.toLowerCase() + 's'}
                    </LinkButton>
                </div>
            )

        if (details.isLoading)
            return <p></p>;

        const description = details.loadedItem?.details?.description;

        if (description)
            return splitAndWrapInPs(description);

        return <p>No information</p>
    }
    
    return <main>
        <section>
            {renderDescription()}
        </section>
    </main>
}

export default observer(DetailsMain);