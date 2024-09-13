import { useContext } from "react";
import { RootStoreContext } from "../../stores/StoreContext";
import BookFiltering from "./BookFiltering";
import IndexView from "../../layouts/IndexLayout/IndexView";

export default function IndexPage() {

    const {grid} = useContext(RootStoreContext).books;

    return <IndexView grid={grid}>
        <BookFiltering grid={grid} />
    </IndexView>
}