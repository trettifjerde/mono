import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Book } from "../../../services/BookService";
import { makeAbsolutePath } from "../../../utils/helpers";
import { Pathnames } from "../../../utils/consts";
import DetailsWrapper from "../../../components/DetailsWrapper";
import DefaultBookImage from '../../../assets/800x800.webp';
import styles from './index.module.scss';

export default function BookWrapper({children, book, skeleton }: {
    book?: Book,
    children?: ReactNode,
    skeleton?: boolean
}) {

    return <DetailsWrapper 
        className={styles.book}
        img={book?.img || DefaultBookImage}
        info={(book && (book.description || 'No information')) || (!skeleton && 'Book not found') || ''}
        skeleton={skeleton}
        notFound={!book && !skeleton}
    >
        <header>
            <hgroup>
                <h1>{book?.title || !skeleton && 'Oops!'}</h1>
                <h5>
                    {book && <Link 
                        to={makeAbsolutePath(Pathnames.authors, book.authorId)} 
                        relative="path"
                        className="link"
                    >
                        {book.authorName}
                    </Link>}
                </h5>
            </hgroup>
        </header>

        <aside>
            {children}
        </aside>
    </DetailsWrapper>
}