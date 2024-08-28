import { memo } from 'react';
import styles from './BookFiltering.module.scss';

const BookFiltering = () => {

    return (<>
        <div>
            <label htmlFor="authorFilter">Only by selected author</label> 
             <input id="authorFilter" placeholder="Enter author's last name" />
        </div>
        <div className={styles.chbx}>
            <label htmlFor="inStock">Currently in stock</label>
            <input id="inStock" type="checkbox" />
        </div>
    </>
    )
}

export default memo(BookFiltering);