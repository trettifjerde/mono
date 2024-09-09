import { observer } from "mobx-react-lite"
import DetailsStore from "../../stores/DetailsStore"
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../../utils/classes/Entity'
import { LoadingState } from "../../utils/consts"
import DetailsReloader from "./DetailsReloader"
import { LinkButton } from "../../components/Buttons"
import { splitAndWrapInPs } from "../../utils/helpers"

function DetailsMain<P extends PC, D extends DC>({details}: {details: DetailsStore<P, D>}) {

    const {loadedItem, state} = details;

    const renderDescription = () => {

        switch (state) {
            case LoadingState.error:
                return <DetailsReloader details={details} />

            case LoadingState.notFound:
                return (
                    <div style={{textAlign: 'center'}}>
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

            case LoadingState.idle:
                const description = loadedItem?.details?.description;

                if (description)
                    return splitAndWrapInPs(description);

                return <p>No information</p>

            default:
                return <p></p>;
        }
    }
    return <main>
        <section>
            { renderDescription() }
        </section>
    </main>
}

export default observer(DetailsMain);