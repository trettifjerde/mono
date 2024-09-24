import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { InputWithIconButton } from '../../../../components/Inputs';
import Entity from '../../../../utils/classes/Entity';
import SortSettings from '../../../../stores/PreviewsView/settings/SortSettings';
import Dropdown from '../../../../components/Dropdown';
import styles from './index.module.scss';

function SortSelect<E extends Entity>({sortSettings, id, label, placeholder, icon}: {
    sortSettings: SortSettings<any, E>,
    id: string,
    label: string,
    placeholder: string,
    icon?: string,
}) {

    const [isDropdownVisible, setDropdownVisible] = useState(false);
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
                icon={selectedOption ? 'icon-cross' : 'icon-chevron-down'}
                hiddenWhenBlurred={false}
                readOnly={true}
                value={selectedOption?.text || ''}
                onClick={(e) => setDropdownVisible(prev => {
                    if (!prev)
                        e.stopPropagation();
                    return !prev;
                })}
                onBtnClick={(e) => {
                    if (selectedOption) {
                        selectOption(null);
                        setDropdownVisible(false);
                        e.stopPropagation();
                    }
                }}
            />

            {isDropdownVisible && <Dropdown
                selectOption={selectOption}
                closeDropdown={() => setDropdownVisible(false)}
                options={options} 
            />}
        </div>
    </div>);
}

export default observer(SortSelect);