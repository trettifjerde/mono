import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import common from '../../../styles/common.module.scss';

export default function PreviewItemWrapper({url, className, isLoading, children}: {
    url?: string,
    isLoading?: boolean,
    className?: string,
    children?: ReactNode
}) {

    if (isLoading)
        return <div className={`${styles.base} ${common.shimmer}`}/>

    return <div className={styles.base}>

        {url && <Link to={url} relative='path' className={styles.item}>
            {children}  
        </Link>}

        {!url && <div className={`${styles.item} ${className || ''}`}>
            {children}
        </div>}
    </div>
}