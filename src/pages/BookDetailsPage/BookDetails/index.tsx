import { Book } from "../../../services/BookService";
import BookWrapper from "../BookWrapper";
import { TextIconButton } from "../../../components/Buttons";
import styles from './index.module.scss';

export default function BookDetails({data: book}: {data: Book}) {
    
    return <BookWrapper 
        book={book}
    >
        <div className={styles.info}>
            <div>
            <p className={styles.price}>{book.price} €</p>
                <span className={styles.stock}>({book.numberInStock} in stock)</span>

                <TextIconButton 
                    className={styles.buy} 
                    disabled={!book.numberInStock}
                    icon="icon-cart"
                    text="Buy"
                />
            </div>
        </div>
    </BookWrapper>
}