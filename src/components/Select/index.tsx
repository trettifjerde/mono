import { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { FilterConfig } from '../../stores/Grid/GridStore';
import { DropdownOptionSelectHandler } from '../../utils/uiTypes';
import { InputWithIconButton } from '../Inputs';
import Dropdown from '../Dropdown';
import styles from './index.module.scss';

type SelectProps<T> = {
    config: FilterConfig<T>,
    selectOption: DropdownOptionSelectHandler<T>
};

function Select<T>({config, selectOption}: SelectProps<T>) {

    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const ddOpenerRef = useRef<HTMLInputElement>(null);

    const {name, label, placeholder, selectedOption, options} = config;

    return (<div>
        <label htmlFor={name}>
            {label}
        </label>
        
        <div className={styles.cont}>
            <InputWithIconButton
                id={name}
                placeholder={placeholder}
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