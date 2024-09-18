import { observer } from "mobx-react-lite";
import AuthorDetailsView from "../../stores/details/AuthorDetailsView";
import PreviewGrid from "../../components/PreviewGrid";
import PreviewGridSkeleton from "../../components/PreviewGrid/PreviewGridSkeleton";
import BookPreviewItem from "../../components/BookPreviewItem";

function AuthorBookGrid({view}: {view: AuthorDetailsView}) {

    if (view.isLoading) 
        return <PreviewGridSkeleton />

    return <PreviewGrid
        previews={view.bookPreviews}
        itemName={view.store.rootStore.books.entityName}
        ItemPreview={BookPreviewItem} 
    />
}

export default observer(AuthorBookGrid);