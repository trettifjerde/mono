import { ReactNode } from "react";
import { Author } from "../../../services/AuthorService";
import DetailsWrapper from "../../../components/DetailsWrapper";
import DefaultBookImage from '../../../assets/800x800.webp';
import styles from './index.module.scss';

export default function AuthorWrapper({children, author, skeleton=false}: {
    children: ReactNode,
    author?: Author,
    skeleton?: boolean
}) {
    return <DetailsWrapper 
        img={author?.img || DefaultBookImage}
        info={(author && (author.bio || 'No biography yet' )) || (!skeleton && 'Author not found') || ''}
        className={styles.author}
        skeleton={skeleton}
        notFound={!author && !skeleton}
    >
        <header>
            <hgroup>
                <h1>{author?.name || (!skeleton && 'Oops!')}</h1>
            </hgroup>
        </header>

        <aside>
            {children}
        </aside>
    </DetailsWrapper>
}