import { Pathnames } from "../utils/consts";
import { makeAbsolutePath } from "../utils/helpers";
import { EntityPreviewComponent } from "../utils/uiTypes";
import Author from "../utils/classes/Author";
import PreviewItem from "./PreviewGrid/PreviewItem";
import styles from './PreviewGrid/PreviewItem/index.module.scss';

const AuthorPreview: EntityPreviewComponent<Author> = ({ item }) => {

    const preview = item.preview;

    return <PreviewItem
        url={makeAbsolutePath(Pathnames.authors, item.id)}
        imgSrc={item.img}
    >
        <div className={styles.inner}>
            <h3>{preview.name}</h3>
            <h5>Books published: {preview.bookN}</h5>
        </div>
    </PreviewItem>
}

export default AuthorPreview;