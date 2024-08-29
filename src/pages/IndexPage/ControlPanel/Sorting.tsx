import { memo } from 'react';
import { authorSortingConfig, bookSortingConfig } from '../../../services/dummySortingOptions';
import { DropdownOption, IndexPageTab } from '../../../utils/types';
import Select from '../../../components/UI/Select';

const selectOption = (opt: DropdownOption | null) => console.log(opt);

const Sorting = ({tab}: {tab: IndexPageTab}) => {

    return (<div>
        <Select 
            id="sorting"
            label="Sort by"
            placeholder="Select type" 
            optionsConfig={tab === IndexPageTab.authors ? authorSortingConfig : bookSortingConfig}
            selectOption={selectOption} 
        />
    </div>)
}

export default memo(Sorting);