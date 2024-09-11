import { makeAbsolutePath } from "../utils/helpers";
import { Pathnames } from "../utils/consts";
import Author from "../utils/classes/Author";
import PreviewItem from "./PreviewGrid/PreviewItem";

export default function AuthorPreview({preview}: {preview: Author['preview'] }) {

    return <PreviewItem url={makeAbsolutePath(Pathnames.authors, preview.id)}>
        <h3>{preview.name}</h3>
        <p>Books published: {preview.bookN}</p>
    </PreviewItem>
}