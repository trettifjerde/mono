import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { PATHNAMES } from '../../utils/consts';
import styles from './TabPanel.module.scss';

export default function TabPanel() {
    return (
        <div className={styles.panel}>
            <TabLink to={PATHNAMES.index}>Books</TabLink>
            <TabLink to={PATHNAMES.authors}>Authors</TabLink>
        </div>
    );
}

function TabLink({to, children}: {to: string, children: ReactNode}) {
    return (
        <NavLink to={to} className={({isActive}) => isActive ? styles.active : ''}>
            {children}
        </NavLink>
    )
}