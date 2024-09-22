import { observer } from "mobx-react-lite";
import AuthorDetailsView from "../../stores/DetailsView/AuthorDetailsView";
import PreviewGrid from "../../components/PreviewGrid";
import BookPreview from "../../components/BookPreview";

function AuthorBookGrid({view}: {view: AuthorDetailsView}) {

    return <PreviewGrid
        isLoading={view.isInitialising}
        items={view.books}
        itemName={view.store.rootStore.books.entityName}
        ItemPreview={BookPreview} 
    />
}

export default observer(AuthorBookGrid);