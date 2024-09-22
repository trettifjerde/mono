import { useContext } from "react"
import { RootStoreContext } from "../../stores/StoreContext";
import PreviewsPage from "../../layouts/PreviewsLayout/PreviewsPage";

export default function AuthorPreviewsPage() {
    const {previewsView} = useContext(RootStoreContext).authors;

    return <PreviewsPage view={previewsView}  />
};