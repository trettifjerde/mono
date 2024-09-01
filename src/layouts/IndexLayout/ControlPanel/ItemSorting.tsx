import { memo } from 'react';
import { DropdownOption, SelectOptionsConfig } from '../../../utils/uiTypes';
import Select from '../../../components/Select';

const dummySelectOption = (opt: DropdownOption | null) => console.log(opt);

function ItemSorting({isAuthorsTab}: {isAuthorsTab: boolean}) {

    return (<div>
        <Select 
            id="sorting"
            label="Sort by"
            placeholder="Select type" 
            optionsConfig={isAuthorsTab ? authorSortingConfig : bookSortingConfig}
            selectOption={dummySelectOption} 
        />
    </div>)
}

enum BookSortingOptions {
    Name = "Title",
    Author = "Author",
    Price = "Price",
};

enum AuthorSortingOptions {
    Name = "Last name",
    NumberOfBooks = "Number of published books"
}

export const bookSortingConfig: SelectOptionsConfig<DropdownOption> = {
    dynamic: false,
    defaultOptions: Object
        .entries(BookSortingOptions)
        .map(([name, value]) => ({
            text: name,
            id: value
        }))
};

export const authorSortingConfig: SelectOptionsConfig<DropdownOption> = {
    dynamic: false,
    defaultOptions: Object
        .entries(AuthorSortingOptions)
        .map(([value, name]) => ({
            text: name,
            id: value
        }))
};

export default memo(ItemSorting);