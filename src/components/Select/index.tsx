import { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { InputWithIconButton } from '../Inputs';
import SortSettings from '../../stores/previews/settings/SortSettings';
import Dropdown from '../Dropdown';
import styles from './index.module.scss';

function Select<P>({sortSettings, id, label, placeholder, icon}: {
    sortSettings: SortSettings<any, P>,
    id: string,
    label: string,
    placeholder: string,
    icon?: string,
}) {

    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const ddOpenerRef = useRef<HTMLInputElement>(null);

    const {options, selectOption, selectedOption} = sortSettings;

    return (<div>
        <label htmlFor={id}>
            {icon && <i className={icon} />}
            <span>{label}</span>
        </label>
        
        <div 
            className={styles.cont} 
            >
            <InputWithIconButton
                id={id}
                placeholder={placeholder}
                color='dark'
                ref={ddOpenerRef}
                icon={selectedOption ? 'icon-cross' : 'icon-chevron-down'}
                hiddenWhenBlurred={false}
                readOnly={true}
                value={selectedOption?.text || ''}
                onClick={() => setDropdownVisible(true)}
                onBtnClick={(e) => {
                    if (selectedOption) {
                        selectOption(null);
                        e.stopPropagation();
                    }
                }}
            />

            {isDropdownVisible && <Dropdown
                ddOpenerRef={ddOpenerRef}
                countFromParent={true}
                selectOption={selectOption}
                closeDropdown={() => setDropdownVisible(false)}
                options={options} 
            />}
        </div>
    </div>);
}

export default observer(Select);