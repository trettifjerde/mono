import { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import SortSelect from '../../stores/Grid/SortSelect';
import { PreviewConstraint } from '../../utils/firestoreDbTypes';
import { InputWithIconButton } from '../Inputs';
import Dropdown from '../Dropdown';
import styles from './index.module.scss';

function Select<P extends PreviewConstraint>({sortSelect, id, label, placeholder, icon}: {
    sortSelect: SortSelect<P>,
    id: string,
    label: string,
    placeholder: string,
    icon?: string,
}) {

    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const ddOpenerRef = useRef<HTMLInputElement>(null);

    const {options, selectType, selectedOption} = sortSelect;

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
                icon={sortSelect.selectedOption ? 'icon-cross' : 'icon-chevron-down'}
                hiddenWhenBlurred={false}
                readOnly={true}
                value={selectedOption?.text || ''}
                onClick={() => setDropdownVisible(true)}
                onBtnClick={(e) => {
                    if (selectedOption) {
                        selectType(null);
                        e.stopPropagation();
                    }
                }}
            />

            {isDropdownVisible && <Dropdown
                ddOpenerRef={ddOpenerRef}
                countFromParent={true}
                selectOption={selectType}
                closeDropdown={() => setDropdownVisible(false)}
                options={options} 
            />}
        </div>
    </div>);
}

export default observer(Select);