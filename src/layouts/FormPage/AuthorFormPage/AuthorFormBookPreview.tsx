import { observer } from "mobx-react-lite";
import { EntityPreviewComponent } from "../../../utils/uiTypes";
import BookPreview from "../../../components/BookPreview";
import Book from "../../../utils/classes/Book";
import styles from './author.module.scss';

const AuthorFormBookPreview : EntityPreviewComponent<Book> = ({item, onItemClick}) => {
    return <BookPreview 
        item={item} 
        isLink={false}
        className={styles.preview}
    >
        <div 
            className={styles.dltBtn}
            onClick={onItemClick ? () => onItemClick(item) : undefined}
        >
            <i className="icon-bin" />
        </div>
    </BookPreview>
}

export default observer(AuthorFormBookPreview);