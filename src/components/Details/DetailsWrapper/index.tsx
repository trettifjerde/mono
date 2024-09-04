import { ReactNode } from "react";
import styles from './index.module.scss';

export default function DetailsWrapper({ info, img, children, className = "", skeleton=false, notFound=false }: {
    img: string,
    info: string,
    children?: ReactNode,
    className?: string,
    skeleton?: boolean,
    notFound?: boolean
}) {

    return <article className={`${styles.base} ${className} ${skeleton ? "shimmer": ""}`}>
        
        {children}

        <figure className={notFound ? styles.bleak : undefined}>
            <img src={img} alt="" />
        </figure>

        <main>
            <p>{info}</p>
        </main>
    </article>
}