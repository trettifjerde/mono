import { ChangeEventHandler, MouseEventHandler, useRef} from 'react';
import { observer } from 'mobx-react-lite';
import { getCleanLCValue } from '../../utils/helpers';
import DynamicSelectSettings from './DynamicSelectSettings';
import DebouncedInputWithButton from '../Inputs/DebouncedInputWithButton';
import Dropdown from '../Dropdown';

const DynamicDropdown = observer(Dropdown);

function DynamicSelect<P extends string>({id, label, entityTitleName, settings, icon, className}: {
    id: string,
    label: string,
    entityTitleName: string,
    settings: DynamicSelectSettings<P>,
    icon?: string,
    className?: string
}) {
    const ddOpenerRef = useRef<HTMLInputElement>(null);

    const {
        isDropdownVisible, 
        lastSelectedOptionText,
        selectNullOptionOnEmptyFilter,
        clearFilterOnOptionSelect,
        openDropdown, 
        toggleDropdown, 
        selectOption, 
        filterOptions
    } = settings;

    const updateOptions : ChangeEventHandler<HTMLInputElement> = (e) => {
        filterOptions(getCleanLCValue(e.target));
    }

    const setSelectedOption : typeof settings.selectOption = (option) => {
        selectOption(option);
        
        if (ddOpenerRef.current) {
            if (clearFilterOnOptionSelect)
                ddOpenerRef.current.value = '';
            else 
                ddOpenerRef.current.value = option?.text || '';
        }
    }

    const clearSelection : MouseEventHandler<HTMLButtonElement> = () => {
        if (ddOpenerRef.current) 
            ddOpenerRef.current.value = '';
        
        if (selectNullOptionOnEmptyFilter)
            selectOption(null);

        filterOptions('');
    }

    return (<div className={className}>
        <label htmlFor={id}>
            {icon && <i className={icon} />}
            <span>{label}</span>
        </label>
        
        <div style={{position: 'relative'}}>
            <DebouncedInputWithButton 
                ref={ddOpenerRef}
                id={id}
                defaultValue={lastSelectedOptionText}
                entityTitleName={entityTitleName}
                onChange={updateOptions}
                onBtnClick={clearSelection}
                onClick={openDropdown}
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