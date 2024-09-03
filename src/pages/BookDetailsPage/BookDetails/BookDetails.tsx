import { Book } from "../../../services/BookService";
import BookWrapper from "../BookWrapper";
import styles from './index.module.scss';

export function BookDetails({data: book}: {data: Book}) {
    return <BookWrapper 
        book={book}
    >
        <div className={styles.info}>
            <div>
            <p className={styles.price}>{book.price} €</p>
                <span className={styles.stock}>({book.numberInStock} in stock)</span>

                <button type="button" className={styles.buy} disabled={!book.numberInStock}>
                    <i className="icon-cart" /> Buy&nbsp;
                </button>
            </div>
        </div>
    </BookWrapper>
}