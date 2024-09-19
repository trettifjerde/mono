import { useRef} from 'react';
import { observer } from 'mobx-react-lite';
import { DropdownOption } from '../../utils/uiTypes';
import DynamicSelectSettings from './DynamicSelectSettings';
import DebouncedInput from '../Inputs/DebouncedInput';
import Dropdown from '../Dropdown';

const DynamicDropdown = observer(Dropdown);

function DynamicSelect<P extends string>({settings, id, label, icon, entityTitleName}: {
    settings: DynamicSelectSettings<P>,
    id: string,
    label: string,
    entityTitleName: string,
    icon?: string,
}) {
    const ddOpenerRef = useRef<HTMLInputElement>(null);

    const {isDropdownVisible, toggleDropdown, openDropdown, selectOption, updateFilterStr} = settings;

    const setSelectedOption = (option: DropdownOption<P> | null) => {
        selectOption(option);
        if (ddOpenerRef.current) 
            ddOpenerRef.current.value = option ? option.text : '';
    }

    return (<div>
        <label htmlFor={id}>
            {icon && <i className={icon} />}
            <span>{label}</span>
        </label>
        
        <div style={{position: 'relative'}}>
            <DebouncedInput 
                ref={ddOpenerRef}
                id={id}
                onClick={openDropdown}
                applyValue={updateFilterStr}
                entityTitleName={entityTitleName}
            />

            {isDropdownVisible && <DynamicDropdown
                ddOpenerRef={ddOpenerRef}
                state={settings.state}
                options={settings.options} 
                selectOption={setSelectedOption}
                closeDropdown={() => toggleDropdown(false)}
            />}
        </div>
    </div>);
}

export default observer(DynamicSelect);