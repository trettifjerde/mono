import { ReactNode } from "react";
import styles from './index.module.scss';

export default function PreviewGrid({skeleton=false, empty=false, children}: {
    skeleton?: boolean,
    empty?: boolean, 
    children: ReactNode
}) {
    const cls = empty ? styles.empty : skeleton ? styles.skeleton : styles.grid;

    return <div className={cls}>
        {children}
    </div>
}