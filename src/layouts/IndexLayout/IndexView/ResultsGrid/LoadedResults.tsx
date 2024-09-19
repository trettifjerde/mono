import { observer } from "mobx-react-lite";
import PreviewGrid from "../../../../components/PreviewGrid";
import PreviewsView from "../../../../stores/PreviewsView/PreviewsView";
import PagButton from "./PagButton";
import styles from './index.module.scss';

function LoadedResults<P, D>(
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