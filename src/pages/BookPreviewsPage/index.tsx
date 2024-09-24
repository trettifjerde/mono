import { useContext } from "react";
import { RootStoreContext } from "../../stores/StoreContext";
import PreviewsPage from "../../layouts/PreviewsLayout/PreviewsPage";
import BookFiltering from "./BookFiltering";

export default function IndexPage() {

    const {previewsView} = useContext(RootStoreContext).books;

    return <PreviewsPage view={previewsView}>
        <BookFiltering view={previewsView} />
    </PreviewsPage>
}