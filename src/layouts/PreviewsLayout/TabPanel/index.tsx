import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Pathnames } from '../../../utils/consts';
import { makeAbsolutePath } from '../../../utils/helpers';
import styles from './index.module.scss';

export default function TabPanel() {
    return (
        <div className={styles.panel}>
            <TabLink to={makeAbsolutePath(Pathnames.index)}>
                <i className='icon-books'/> 
                <span>Books</span>
            </TabLink>
            <TabLink to={makeAbsolutePath(Pathnames.authors)}>
                <i className='icon-author' />
                <span>Authors</span>
            </TabLink>
        </div>
    );
}

function TabLink({to, children}: {to: string, children: ReactNode}) {
    return (
        <NavLink 
            to={to} 
            className={({isActive}) => isActive ? styles.active : ''}
        >
            <h2>{children}</h2>
        </NavLink>
    )
}