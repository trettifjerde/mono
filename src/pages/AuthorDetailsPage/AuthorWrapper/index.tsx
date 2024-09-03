import { ReactNode } from "react";
import { Author } from "../../../services/AuthorService";
import DetailsWrapper from "../../../components/DetailsWrapper";
import DefaultBookImage from '../../../assets/800x800.webp';
import styles from './index.module.scss';

export default function AuthorWrapper({children, author}: {
    children: ReactNode,
    author?: Author
}) {
    return <DetailsWrapper 
        img={author?.img || DefaultBookImage}
        info={author ? (author.bio || 'No biography yet') : ''}
        className={styles.author}
        skeleton={!author}
    >
        <header>
            <hgroup>
                <h1>{author?.name || ''}</h1>
            </hgroup>
        </header>

        <aside>
            {children}
        </aside>
    </DetailsWrapper>
}