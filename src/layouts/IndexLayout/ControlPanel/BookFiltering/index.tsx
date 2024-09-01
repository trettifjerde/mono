import { memo } from 'react';
import { DropdownOption, SelectOptionsConfig } from '../../../../utils/uiTypes';
import Select from '../../../../components/Select';
import styles from './index.module.scss';

const dummySelectOption = (opt: DropdownOption | null) => console.log(opt);

const BookFiltering = () => {

    const authorFilterConfig: SelectOptionsConfig<DropdownOption> = {
        dynamic: true,
        getOptions: (initArg: string) => {
            if (!initArg)
                return Promise.resolve(null);
    
            // return bookDataService.filterByAuthor(initArg);
            return Promise.resolve([]);
        }
    };

    return (<>
        <div>
            <Select 
                id="authorFilter" 
                placeholder="Type author's last name"
                label="Only by selected author"
                optionsConfig={authorFilterConfig}
                selectOption={dummySelectOption}
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
