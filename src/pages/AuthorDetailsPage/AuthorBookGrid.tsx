import { observer } from "mobx-react-lite";
import AuthorSlice from "../../stores/slices/AuthorSlice";
import { LoadingState } from "../../utils/consts";
import PreviewGridList from "../../components/PreviewGrid";
import PreviewGridSkeleton from "../../components/PreviewGrid/PreviewGridSkeleton";
import BookPreviewItem from "../../components/BookPreviewItem";

function AuthorBookGrid({details}: {details: AuthorSlice['details']}) {

    const {state, loadedItem} = details;

    switch (state) {
        case LoadingState.loading:
            return <PreviewGridSkeleton />

        default:
            return <PreviewGridList
                previews={loadedItem?.details?.books || []}
                itemName={"Book"} 
                ItemPreview={BookPreviewItem} 
            />
    }
}

export default observer(AuthorBookGrid);