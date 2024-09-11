// import { DropdownOptionSelectHandler } from '../../../utils/uiTypes';
import styles from './index.module.scss';
// import { useSearchParams } from 'react-router-dom';
// import { ChangeEventHandler, useCallback } from 'react';
// import { updateSearchParams } from '../../../utils/helpers';

const BookFiltering = () => {

    // const [searchParams, setSearchParams] = useSearchParams();

    // const inStockChecked = !!searchParams.get('inStock');

    // const selectAuthor : DropdownOptionSelectHandler = useCallback(option => {
    //     setSearchParams(prev => updateSearchParams(
    //         prev, 
    //         'author', 
    //         option?.value
    //     ))
    // }, [setSearchParams]);

    // const selectInStock : ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    //     setSearchParams(prev => updateSearchParams(
    //         prev,
    //         'inStock',
    //         e.target.checked ? 'true' : undefined
    //     ))
    // }, [setSearchParams]);

    return (<>
        {/* <div>
            <Select 
                id="authorFilter" 
                placeholder="Type author's name"
                label="Only by selected author"
                options={[]}
                selectOption={() => {}}
             />
        </div> */}

        <div className={styles.chbx}>
            <label htmlFor="inStock">Currently in stock</label>
            <input 
                id="inStock" type="checkbox" 
                defaultChecked={false} 
                onChange={() => {}}
            />
        </div>
    </>
    )
};

export default BookFiltering;
