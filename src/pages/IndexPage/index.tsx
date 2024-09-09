import { useContext } from "react";
import { RootStoreContext } from "../../stores/StoreContext";
import IndexGrid from "../../layouts/IndexLayout/IndexGrid";
import BookPreviewItem from "../../components/BookPreviewItem";

export default function IndexPage() {

    const {grid} = useContext(RootStoreContext).books;

    return <IndexGrid 
        grid={grid}
        ItemPreview={BookPreviewItem}
    />
}