import { Pathnames } from "../utils/consts";
import { makeAbsolutePath } from "../utils/helpers";
import { EntityPreviewComponent } from "../utils/uiTypes";
import Book from "../utils/classes/Book";
import PreviewItemWrapper from "./PreviewGrid/PreviewItemWrapper";

const BookPreview : EntityPreviewComponent<Book> = ({item, isLink=true, className, children}) => {

    const preview = item.preview;

    return <PreviewItemWrapper
        className={className}
        url={isLink ? makeAbsolutePath(Pathnames.books, item.id) : ''}
    >
        <h3>
            {preview.name}
        </h3>
        <h5>
            by {preview.authorName || 'unknown author'}
        </h5>
        <div>
            Price: ${preview.price}
        </div>
        <div>
            Number in stock: {preview.inStock}
        </div>

        {children}

    </PreviewItemWrapper>
};

export default BookPreview;