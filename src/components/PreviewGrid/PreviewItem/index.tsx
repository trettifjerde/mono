import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';

export default function PreviewItem({url, children}: {
    url?: string,
    children?: ReactNode
}) {

    return <div className={`${styles.base} ${url ? '' : 'shimmer'}`}>
        {url && (
            <Link 
                to={url} relative='path' 
                className={styles.item}
            >
            {children}
            </Link>
        )}
    </div>
}