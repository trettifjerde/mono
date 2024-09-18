import { useContext } from "react"
import { RootStoreContext } from "../../stores/StoreContext";
import IndexView from "../../layouts/IndexLayout/IndexView";

export default function AuthorsPage() {
    const {previewsView} = useContext(RootStoreContext).authors;

    return <IndexView view={previewsView}  />
};