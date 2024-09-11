import { useRef } from 'react';
import GridStore from '../../../stores/Grid/GridStore';
import { DropdownOptionSelectHandler } from '../../../utils/uiTypes';
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../../../utils/classes/Entity';
import Select from '../../../components/Select';

export function ItemSorting<P extends PC, D extends DC>({grid}: {grid: GridStore<P, D>}) {

    const { sortOptions, setSortOption } = grid;

    const ref = useRef<HTMLInputElement>(null);

    const selectOption : DropdownOptionSelectHandler = option => {
        if (ref.current) {
            ref.current.value = option?.text || '';
            setSortOption(option?.value || null);
        }
    }

    return (<div>
        <Select 
            id={sortOptions.name}
            label="Sort by"
            ref={ref}
            readOnly
            placeholder="Select type" 
            options={sortOptions.options}
            selectOption={selectOption} 
        />
    </div>)
}