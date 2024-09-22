import { observer } from "mobx-react-lite"
import { makeAbsolutePath, splitAndWrapInPs } from "../../utils/helpers"
import { LinkButton } from "../../components/Buttons"
import DetailsView from "../../stores/DetailsView/DetailsView"
import DetailsReloader from "./DetailsReloader"
import common from '../../styles/common.module.scss';
import Entity from "../../utils/classes/Entity"

function DetailsMain<E extends Entity>({ view }: { view: DetailsView<E> }) {

    const renderDescription = () => {

        if (view.isError)
            return <DetailsReloader view={view} />

        if (view.isNotFound)
            return (
                <div style={{ textAlign: 'center' }}>
                    <p>{view.store.entityName} not found</p>

                    <LinkButton
                        className={common.linkCen}
                        to={makeAbsolutePath(view.store.previewsView.pathname)}
                        relative="path"
                    >
                        Browse other {view.store.entityName.toLowerCase() + 's'}
                    </LinkButton>
                </div>
            )

        if (view.isInitialising)
            return <p></p>;

        const description = view.loadedItem?.description || '';

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