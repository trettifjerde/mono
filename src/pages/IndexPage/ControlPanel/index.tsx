import { useLoaderData } from 'react-router-dom';
import { IndexLoaderData, IndexPageTab } from '../../../utils/types';
import InputControl from '../../../components/UI/InputControl';
import Sorting from './Sorting';
import BookFiltering from './BookFiltering';
import styles from './index.module.scss';

function dummyOnChange(value: string) {
    console.log(value);
}

function dummyOnCancel() {
    console.log('Filter string cleared');
}

export default function ControlPanel() {
    const {tab} = useLoaderData() as IndexLoaderData;

    return (
        <div className={styles.cont}>
            <div className={styles.search}>
                <label htmlFor="itemSearchBar">Search {tab === IndexPageTab.authors ? 'authors' : 'books'}</label>
                <InputControl 
                    id="itemSearchBar"
                    placeholder={`Start typing ${tab === IndexPageTab.authors ? 'name' : 'title'}...`} 
                    onChange={dummyOnChange}
                    onCancel={dummyOnCancel}
                />
            </div>

            <Sorting tab={tab} />
            
            {tab === IndexPageTab.books && <BookFiltering />}
        </div>
    );
}