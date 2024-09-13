import { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { SelectSettings } from '../../stores/Grid/GridStore';
import { DropdownOptionSelectHandler } from '../../utils/uiTypes';
import { InputWithIconButton } from '../Inputs';
import Dropdown from '../Dropdown';
import styles from './index.module.scss';

type SelectProps<T> = {
    config: SelectSettings<T>,
    selectOption: DropdownOptionSelectHandler<T>
};

function Select<T>({config, selectOption}: SelectProps<T>) {

    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const ddOpenerRef = useRef<HTMLInputElement>(null);

    const {selectedOption, options} = config;

    return (<div>
        <label htmlFor="sortBy">Sort by</label>
        
        <div className={styles.cont}>
            <InputWithIconButton
                id="sortBy"
                placeholder="Select type"
                ref={ddOpenerRef}
                readOnly={true}
                value={selectedOption?.text || ''}
                onClick={() => setDropdownVisible(true)}
                onBtnClick={() => selectOption(null)}
            />

            {isDropdownVisible && <Dropdown
                ddOpenerRef={ddOpenerRef}
                selectOption={selectOption}
                closeDropdown={() => setDropdownVisible(false)}
                options={options} 
            />}
        </div>
    </div>);
}

export default observer(Select);