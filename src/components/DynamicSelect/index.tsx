import { observer } from 'mobx-react-lite';
import { InputWithIconButton } from '../Inputs';
import DynamicSelectSettings from './DynamicSelectSettings';
import Dropdown from '../Dropdown';

const DynamicDropdown = observer(Dropdown);

function DynamicSelect<P extends string>({id, placeholderWord, className, settings}: {
    id: string,
    placeholderWord: string,
    className?: string,
    settings: DynamicSelectSettings<P>
}) {

    const {
        filterStr,
        isDropdownVisible, 
        selectedOption, 
        toggleDropdown, 
        closeDropdown,
        startTimer,
        selectOption, 
        clearSelection,
    } = settings;

    return (<div className={className} style={{position: 'relative'}}>
            <InputWithIconButton 
                id={id}
                placeholder={`Start typing ${placeholderWord}...`}
                value={filterStr}
                readOnly={!!selectedOption}
                onChange={startTimer}
                onBtnClick={() => clearSelection()}
                onClick={toggleDropdown}
            />

            {isDropdownVisible && <DynamicDropdown
                state={settings.state}
                options={settings.options} 
                selectOption={selectOption}
                closeDropdown={closeDropdown}
            />}
    </div>);
}

export default observer(DynamicSelect);