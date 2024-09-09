import { useLocation } from 'react-router-dom';
import { Pathnames } from '../../../utils/consts';
import { makeAbsolutePath } from '../../../utils/helpers';

import InputControl from '../../../components/InputControl';
import ItemSorting from './ItemSorting';
import BookFiltering from './BookFiltering';
import styles from './index.module.scss';

function dummyOnChange(value: string) {
    console.log(value);
}

function dummyOnCancel() {
    console.log('Filter string cleared');
}

export default function ControlPanel() {
    const location = useLocation();
    const isAuthorsTab = location.pathname === makeAbsolutePath(Pathnames.authors);

    return (
        <div className={styles.panel}>
            <div className={styles.search}>
                <label htmlFor="itemSearchBar">Search {isAuthorsTab ? 'authors' : 'books'}</label>
                <InputControl 
                    id="itemSearchBar"
                    placeholder={`Start typing ${isAuthorsTab ? 'name' : 'title'}...`} 
                    onChange={dummyOnChange}
                    onCancel={dummyOnCancel}
                />
            </div>

            <ItemSorting isAuthorsTab={isAuthorsTab} />
            
            {!isAuthorsTab && <BookFiltering />}
        </div>
    );
}