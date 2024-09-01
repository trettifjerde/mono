import { Link, useLoaderData } from "react-router-dom";
import { Book } from "../../services/BookService";
import { Pathnames } from "../../utils/consts";
import { makeAbsolutePath } from "../../utils/helpers";
import { BookLoaderData } from "../../utils/loaders";
import SuspendedEntry from "../../components/SuspendedEntry";
import BookWrapper from "./BookWrapper";
import styles from './index.module.scss';

export default function BookDetailsPage() {
    const {data} = useLoaderData() as BookLoaderData;
    
    return <SuspendedEntry 
        promise={data}
        Component={BookDetails} 
        Fallback={BookSkeleton}
    />
}

function BookDetails({data: book}: {data: Book}) {
    return <BookWrapper 
        description={book.description}
        img={book.img}
    >
        <div className={styles.book}>
            <hgroup>
                <h1>{book.title}</h1>
                <h5><Link to={makeAbsolutePath(Pathnames.authors, book.authorId)} relative="path">{book.authorName}</Link></h5>
            </hgroup>

            <div className={styles.info}>
                <p className={styles.price}>{book.price} €</p>
                <div>
                    <span className={styles.stock}>({book.numberInStock} in stock)</span>

                    <button type="button" className={styles.buy} disabled={!book.numberInStock}>
                        <i className="icon-cart" /> Buy&nbsp;
                    </button>
                </div>
            </div>
        </div>
    </BookWrapper>
}

function BookSkeleton() {
    return <BookWrapper />
}