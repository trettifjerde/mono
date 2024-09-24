import { useEffect } from 'react';
import { DropdownOption, DropdownOptionSelectHandler } from '../../utils/uiTypes';
import { LoadingState } from '../../utils/consts';
import styles from './index.module.scss';

export default function Dropdown<T extends string>({
    selectOption, closeDropdown, options, state=LoadingState.idle
}: {
    options: DropdownOption<T>[],
    selectOption: DropdownOptionSelectHandler<T>,
    closeDropdown: () => void,
    state?: LoadingState
}) {

    const dropdownList = function(){

        switch (state) {
            case LoadingState.pending:
                return <li className={styles.loading}>
                    Loading...
                </li>

            case LoadingState.error:
                return <li className={styles.loading}>
                    An error occurred. Try again
                </li>

            default: 

                if (!options.length)
                    return <li className={styles.empty}>
                        No results
                    </li>

                return options.map(option => (
                    <li 
                        key={option.value} 
                        onClick={() => selectOption(option)}
                    >
                        {option.renderElement()}
                    </li>
                ));
        }
    }();

    useEffect(() => {
        function triggerCloseDropdown(e: Event) {
            closeDropdown();
            e.stopPropagation();
        }

        document.addEventListener('click', triggerCloseDropdown);

        return () => document.removeEventListener('click', triggerCloseDropdown);

    }, [closeDropdown]);

    return <menu className={styles.dd}> 
        {dropdownList} 
    </menu>
}