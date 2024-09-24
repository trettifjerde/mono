import { observer } from "mobx-react-lite";
import Entity from "../../../../utils/classes/Entity";
import PreviewGrid from "../../../../components/PreviewGrid";
import PreviewsView from "../../../../stores/PreviewsView/PreviewsView";
import PagButton from "./PagButton";
import styles from './index.module.scss';

function LoadedResults<E extends Entity>({ view }: { view: PreviewsView<E> }) {

    const { currentView, ItemPreview } = view;

    return <PreviewGrid
        isLoading={view.isInitialising}
        items={currentView.pageItems}
        itemName={view.store.entityName}
        ItemPreview={ItemPreview}
        className={styles.grid}
    >

        <div className={styles.pag}>
            <PagButton
                icon="icon-arrow-left"
                isVisible={currentView.isPrevBtnVisible}
                onClick={currentView.showPrev}
            />
            <PagButton
                isLoading={view.isPending}
                icon="icon-arrow-right"
                isVisible={currentView.isNextBtnVisible}
                onClick={currentView.showNext}
            />
        </div>
    </PreviewGrid>
}

export default observer(LoadedResults);