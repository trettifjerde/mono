import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import common from '../../../styles/common.module.scss';

export default function PreviewItem({url=false, className, imgSrc, skeleton, children}: {
    url?: string | false,
    imgSrc?: string,
    skeleton?: boolean,
    className?: string,
    children?: ReactNode
}) {

    if (skeleton)
        return <div className={`${styles.base} ${common.shimmer}`}/>
    

    return <Wrapper url={url} 
        className={`${styles.item} ${className || ''}`}
    >
        {imgSrc && <img src={imgSrc} /> }

        {children}
        
    </Wrapper>
}

const Wrapper = ({url, className, children}: {
    url: string | false, 
    className: string,
    children?: ReactNode
}) => {
    if (url) 
        return <Link to={url} className={className}>
            {children}  
        </Link>

    return <div className={className}>
        {children}
    </div>
    
}