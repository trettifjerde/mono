import { useContext } from "react"
import { RootStoreContext } from "../../stores/StoreContext";
import Author from "../../utils/classes/Author";
import { Pathnames } from "../../utils/consts";
import { makeAbsolutePath } from "../../utils/helpers";
import IndexGrid from "../../layouts/IndexLayout/IndexGrid";
import PreviewItem from "../../components/PreviewGrid/PreviewItem";

export default function AuthorsPage() {
    const {grid} = useContext(RootStoreContext).authors;

    return <IndexGrid 
        grid={grid}
        ItemPreview={AuthorPreview}
    />
};

function AuthorPreview({preview}: {preview: Author['preview'] }) {

    return <PreviewItem url={makeAbsolutePath(Pathnames.authors, preview.id)}>
        <h3>{preview.name}</h3>
        <p>Books published: {preview.bookN}</p>
    </PreviewItem>
}
