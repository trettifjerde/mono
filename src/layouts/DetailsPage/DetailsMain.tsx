import { observer } from "mobx-react-lite"
import { splitAndWrapInPs } from "../../utils/helpers"
import { LinkButton } from "../../components/Buttons"
import DetailsView from "../../stores/DetailsView/DetailsView"
import DetailsReloader from "./DetailsReloader"
import common from '../../styles/common.module.scss';

function DetailsMain({ view }: { view: DetailsView }) {

    const renderDescription = () => {

        if (view.isError)
            return <DetailsReloader view={view} />

        if (view.isNotFound)
            return (
                <div style={{ textAlign: 'center' }}>
                    <p>{view.store.entityName} not found</p>

                    <LinkButton
                        className={common.linkCen}
                        color="blue"
                        to={view.store.makePathname()}
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