import { ReactNode } from "react";
import { Author } from "../../../services/AuthorService";
import DetailsWrapper from "../../../components/Details/DetailsWrapper";
import DefaultBookImage from '../../../assets/800x800.webp';
import styles from './index.module.scss';
import { DetailsHeader } from "../../../components/Details/DetailsHeader";
import DetailsMenu from "../../../components/Details/DetailsMenu";

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
        <DetailsMenu id={author?.id} />

        <DetailsHeader 
            heading={author?.name} 
            skeleton={skeleton} 
        />

        <aside>
            {children}
        </aside>
    </DetailsWrapper>
}