import { observer } from "mobx-react-lite"
import { splitAndWrapInPs } from "../../utils/helpers"
import { LinkButton } from "../../components/Buttons"
import DetailsView from "../../stores/details/DetailsView"
import DetailsReloader from "./DetailsReloader"

function DetailsMain<P, D>({ view }: { view: DetailsView<P, D> }) {

    const renderDescription = () => {

        if (view.isError)
            return <DetailsReloader view={view} />

        if (view.isNotFound)
            return (
                <div style={{ textAlign: 'center' }}>
                    <p>{view.store.entityName} not found</p>

                    <LinkButton
                        className="link-center"
                        to={view.store.previewsView.rootPath}
                        relative="path"
                    >
                        Browse other {view.store.entityName.toLowerCase() + 's'}
                    </LinkButton>
                </div>
            )

        if (view.isLoading)
            return <p></p>;

        const description = view.loadedItem?.details?.description;

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