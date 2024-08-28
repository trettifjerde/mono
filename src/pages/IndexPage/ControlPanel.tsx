import { ChangeEvent } from 'react';
import { useLoaderData } from 'react-router-dom';
import { IndexLoaderData, IndexPageTab } from '../../utils/types';
import SearchBar from '../../components/UI/SearchBar';
import Sorting from './control-panel/Sorting';
import BookFiltering from './control-panel/BookFiltering';
import styles from './ControlPanel.module.scss';

function dummyOnChange(e: ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
}

export default function ControlPanel() {
    const {tab} = useLoaderData() as IndexLoaderData;

    return (
        <div className={styles.cont}>
            <SearchBar 
                placeholder={`Start typing ${tab === IndexPageTab.authors ? 'name' : 'title'}...`} 
                className={styles.search}
                onChange={dummyOnChange}
            />

            <Sorting tab={tab} />
            
            {tab === IndexPageTab.books && <BookFiltering />}
        </div>
    );
}