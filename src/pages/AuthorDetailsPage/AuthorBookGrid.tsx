import { observer } from "mobx-react-lite";
import PreviewGridList from "../../components/PreviewGrid";
import PreviewGridSkeleton from "../../components/PreviewGrid/PreviewGridSkeleton";
import BookPreviewItem from "../../components/BookPreviewItem";
import AuthorDetailsView from "../../stores/details/AuthorDetailsView";

function AuthorBookGrid({details}: {details: AuthorDetailsView}) {

    if (details.isLoading) 
        return <PreviewGridSkeleton />
    
    const previews = details.books;

    return <PreviewGridList
        previews={previews}
        itemName={details.slice.entityName}
        ItemPreview={BookPreviewItem} 
    />
}

export default observer(AuthorBookGrid);