import { useContext } from "react";
import { RootStoreContext } from "../../stores/StoreContext";
import IndexView from "../../layouts/IndexLayout/IndexView";
import BookFiltering from "./BookFiltering";

export default function IndexPage() {

    const {previewsView} = useContext(RootStoreContext).books;

    return <IndexView view={previewsView}>
        <BookFiltering view={previewsView} />
    </IndexView>
}