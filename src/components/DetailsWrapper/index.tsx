import { ReactNode } from "react";
import { IconLinkButton } from "../Buttons";
import styles from './index.module.scss';

export function DetailsWrapper({ info, img, children, className = "", skeleton=false, notFound=false }: {
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

export function DetailsHeader({heading, skeleton, children}: {
    skeleton: boolean,
    heading?: string, 
    children?: ReactNode
}) {
    return <header>

        <DetailsMenu hollow={!heading && skeleton} />

        <hgroup>
            <h1>{heading || (!skeleton && 'Oops!')}</h1>

            {children}
        </hgroup>        
    </header>
}

function DetailsMenu({hollow=true}: {hollow?: boolean}) {
    return <menu>
        <li>
            {!hollow && <IconLinkButton to="edit" icon="icon-edit" color="blue"/>}
        </li>
        <li>
            {!hollow && <IconLinkButton to="delete" icon="icon-bin" color="black"/>}
        </li>
    </menu>
}