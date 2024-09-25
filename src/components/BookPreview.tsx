import { Pathnames } from "../utils/consts";
import { makeAbsolutePath } from "../utils/helpers";
import { EntityPreviewComponent } from "../utils/uiTypes";
import Book from "../utils/classes/Book";
import PreviewItem from "./PreviewGrid/PreviewItem";
import styles from './PreviewGrid/PreviewItem/index.module.scss';

const BookPreview : EntityPreviewComponent<Book> = ({item, isLink=true, className, children}) => {

    const preview = item.preview;

    return <PreviewItem className={className}
        url={isLink && makeAbsolutePath(Pathnames.books, item.id)}
        imgSrc={item.img}
    >
        <div className={styles.inner}>
            <h3>
                {preview.name}
            </h3>
            <h5>
                by {preview.authorName || 'unknown author'}
            </h5>
        </div>

        <div>
            <h2 className={styles.ribbon}>{preview.price} €</h2>
            <p className={styles.hidden}>({preview.inStock} in stock)</p>
        </div>
        {children}

    </PreviewItem>
};

export default BookPreview;