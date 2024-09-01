import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Pathnames } from '../../../utils/consts';
import { makeAbsolutePath } from '../../../utils/helpers';
import styles from './index.module.scss';

export default function TabPanel() {
    return (
        <div className={styles.panel}>
            <TabLink to={makeAbsolutePath(Pathnames.index)}>Books</TabLink>
            <TabLink to={makeAbsolutePath(Pathnames.authors)}>Authors</TabLink>
        </div>
    );
}

function TabLink({to, children}: {to: string, children: ReactNode}) {
    return (
        <NavLink 
            to={to} 
            relative="path"
            className={({isActive}) => isActive ? styles.active : ''}
        >
            {children}
        </NavLink>
    )
}