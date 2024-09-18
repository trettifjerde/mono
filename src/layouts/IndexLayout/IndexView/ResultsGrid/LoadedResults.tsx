import { observer } from "mobx-react-lite";
import { DetailsConstraint, PreviewConstraint } from "../../../../utils/firestoreDbTypes";
import PreviewGrid from "../../../../components/PreviewGrid";
import PreviewsView from "../../../../stores/previews/PreviewsView";
import PagButton from "./PagButton";
import styles from './index.module.scss';

function LoadedResults<P extends PreviewConstraint, D extends DetailsConstraint>(
    {view}: {view: PreviewsView<P, D>}) 
    {

    const {currentView, ItemPreview} = view;
    return <PreviewGrid 
        previews={currentView.pagePreviews} 
        itemName={view.store.entityName}
        ItemPreview={ItemPreview}
    >  

    <div className={styles.pag}>
        <PagButton 
            icon="icon-arrow-left" 
            isVisible={currentView.isPrevBtnVisible}
            onClick={currentView.showPrev}
        />
        <PagButton 
            icon="icon-arrow-right" 
            isVisible={currentView.isNextBtnVisible}
            onClick={currentView.showNext}
        />
    </div>
    </PreviewGrid> 
}

export default observer(LoadedResults);