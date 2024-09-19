import { ReactNode } from "react";
import styles from './index.module.scss';

export default function PreviewGridWrapper({type='grid', className, children}: {
    type?: 'skeleton' | 'empty' | 'grid',
    className?: string,
    children: ReactNode
}) {

    return <div className={`${styles[type]} ${className}`}>
        {children}
    </div>
}