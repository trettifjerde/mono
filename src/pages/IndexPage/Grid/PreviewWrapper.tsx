import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './PreviewWrapper.module.scss';

export default function Preview({url, children, className=''}: {
    url?: string,
    children?: ReactNode,
    className?: string
}) {

    const clName = `${styles.base} ${url ? styles.item : ''} ${className}`;

    return url ? (
        <Link to={url} relative='path' className={clName}>
            {children}
        </Link>
    ) : (
        <div className={clName}>{children}</div>
    )
}