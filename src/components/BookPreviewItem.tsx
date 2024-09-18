import { Pathnames } from "../utils/consts";
import { makeAbsolutePath } from "../utils/helpers";
import { EntityPreviewComponent } from "../utils/uiTypes";
import Book from "../utils/classes/Book";
import PreviewItem from "./PreviewGrid/PreviewItem";

const BookPreviewItem : EntityPreviewComponent<Book> = ({preview}) => {

    return <PreviewItem url={makeAbsolutePath(Pathnames.books, preview.id)}>
        <h3>{preview.name}</h3>
        <h5>by {preview.authorName || 'unknown author'}</h5>
        <p>Price: ${preview.price}</p>
        <p>Number in stock: {preview.inStock}</p>
    </PreviewItem>
};

export default BookPreviewItem;