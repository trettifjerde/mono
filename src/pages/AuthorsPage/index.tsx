import { useContext } from "react"
import { RootStoreContext } from "../../stores/StoreContext";
import IndexView from "../../layouts/IndexLayout/IndexView";


export default function AuthorsPage() {
    const {grid} = useContext(RootStoreContext).authors;

    return <IndexView grid={grid}  />
};