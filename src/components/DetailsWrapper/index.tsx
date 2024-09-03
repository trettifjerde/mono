import { ReactNode } from "react";
import styles from './index.module.scss';

export default function DetailsWrapper({ info, img, children, className = "", skeleton=false }: {
    img: string,
    info: string,
    children?: ReactNode,
    className?: string,
    skeleton?: boolean
}) {
    return <article className={`${styles.base} ${className} ${skeleton ? "shimmer": ""}`}>
        
        {children}

        <figure>
            <img src={img} alt="" />
        </figure>

        <main>
            <p>{info}</p>
        </main>
    </article>
}