import { DropdownOption, DropdownOptionSelectHandler } from '../../utils/uiTypes';
import styles from './index.module.scss';

export default function Dropdown({selectOption, options, isFetching=false}: {
    selectOption: DropdownOptionSelectHandler,
    options?: DropdownOption[],
    isFetching?: boolean
}) {

    if (!options)
        return null;

    const dropdownList = function(){
        if (isFetching)
            return <li className={styles.loading}>
                Loading...
            </li>

        if (!options.length)
            return <li className={styles.empty}>
                No results
            </li>

        return options.map(option => (<li
            key={option.value}
            onClick={() => selectOption(option)}
        >
            {option.text}
        </li>))
    }();

    return (
        <menu className={styles.dd}> 
            {dropdownList} 
        </menu>
    );
}