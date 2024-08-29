import { memo } from 'react';
import { DropdownOption } from '../../../utils/types';
import { authorFilterConfig } from '../../../services/dummySortingOptions';
import Select from '../../../components/UI/Select';
import styles from './BookFiltering.module.scss';

const selectOption = (opt: DropdownOption | null) => console.log(opt);

const BookFiltering = () => {
    return (<>
        <div>
            <Select 
                id="authorFilter" 
                placeholder="Type author's last name"
                label="Only by selected author"
                optionsConfig={authorFilterConfig}
                selectOption={selectOption}
             />
        </div>
        <div className={styles.chbx}>
            <label htmlFor="inStock">Currently in stock</label>
            <input id="inStock" type="checkbox" />
        </div>
    </>
    )
};

export default memo(BookFiltering);