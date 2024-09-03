import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Book } from "../../../services/BookService";
import { makeAbsolutePath } from "../../../utils/helpers";
import { Pathnames } from "../../../utils/consts";
import DetailsWrapper from "../../../components/DetailsWrapper";
import DefaultBookImg from '../../../assets/800x800.webp';
import styles from './index.module.scss';

export default function BookWrapper({children, book }: {
    book?: Book,
    children?: ReactNode
}) {
    return <DetailsWrapper 
        className={styles.book}
        img={book?.img || DefaultBookImg}
        info={book?.description || (children ? 'No description' : '')}
        skeleton={!book}
    >
        <header>
            <hgroup>
                <h1>{book?.title}</h1>
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