import { ReactNode } from 'react';
import styles from './form.module.scss';

export default function ButtonsWrapper({children}: {children: ReactNode}) {
    return <div className={styles.btns}>
        {children}
    </div>
}