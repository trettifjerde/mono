import { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { InputWithIconButton } from '../Inputs';
import Dropdown from '../Dropdown';
import styles from './index.module.scss';
import { PreviewConstraint } from '../../utils/firestoreDbTypes';
import SortSelect from '../../stores/Grid/SortSelect';

function Select<P extends PreviewConstraint>({sortSelect}: {sortSelect: SortSelect<P>}) {

    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const ddOpenerRef = useRef<HTMLInputElement>(null);

    const {options, selectType, selectedOption} = sortSelect;

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
                onBtnClick={() => selectType(null)}
            />

            {isDropdownVisible && <Dropdown
                ddOpenerRef={ddOpenerRef}
                selectOption={selectType}
                closeDropdown={() => setDropdownVisible(false)}
                options={options} 
            />}
        </div>
    </div>);
}

export default observer(Select);