import { ReactNode } from "react";
import { Book } from "../../../services/BookService";
import DefaultBookImg from '../../../assets/800x800.webp';
import styles from './index.module.scss';

export default function BookWrapper({description, img, children}: {
    description?: Book['description'],
    img?: Book['img'],
    children?: ReactNode
}) {
    return <article className={`${styles.book} ${children ? '' : 'shimmer'}`}>
        <header>
            {children}
        </header>
        <figure>
            <img src={img || DefaultBookImg} alt=""/>
        </figure>
        <main>
            <p>
                {description || (children ? 'No description' : '')}
            </p>
        </main>
    </article>
}