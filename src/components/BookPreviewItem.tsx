import Book from "../utils/classes/Book";
import { Pathnames } from "../utils/consts";
import { makeAbsolutePath } from "../utils/helpers";

import PreviewItem from "./PreviewGrid/PreviewItem";

export default function BookPreviewItem({preview}: {preview: Book['preview']}) {

    return <PreviewItem url={makeAbsolutePath(Pathnames.books, preview.id)}>
        <h3>{preview.name}</h3>
        <h5>by {preview.authorName}</h5>
        <p>Price: ${preview.price}</p>
        <p>Number in stock: {preview.inStock}</p>
    </PreviewItem>
};