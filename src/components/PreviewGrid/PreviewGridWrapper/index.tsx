import { ReactNode } from "react";
import styles from './index.module.scss';

export default function PreviewGridWrapper({type='grid', children}: {
    type?: 'skeleton' | 'empty' | 'grid',
    children: ReactNode
}) {

    return <div className={styles[type]}>
        {children}
    </div>
}