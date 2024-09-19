import { observer } from "mobx-react-lite";
import AuthorDetailsView from "../../stores/DetailsView/AuthorDetailsView";
import PreviewGrid from "../../components/PreviewGrid";
import PreviewGridSkeleton from "../../components/PreviewGrid/PreviewGridSkeleton";
import BookPreviewItem from "../../components/PreviewGrid/BookPreviewItem";

function AuthorBookGrid({view, className}: {
    view: AuthorDetailsView,
    className?: string
}) {

    if (view.isLoading) 
        return <PreviewGridSkeleton />

    return <PreviewGrid
        previews={view.bookPreviews}
        itemName={view.store.rootStore.books.entityName}
        ItemPreview={BookPreviewItem} 
        className={className}
    />
}

export default observer(AuthorBookGrid);