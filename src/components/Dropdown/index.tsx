import { MouseEventHandler, RefObject, useEffect } from 'react';
import { DropdownOption, DropdownOptionSelectHandler } from '../../utils/uiTypes';
import styles from './index.module.scss';

export default function Dropdown<T>({
    ddOpenerRef, selectOption, closeDropdown, options, isFetching=false
}: {
    ddOpenerRef: RefObject<HTMLElement>,
    selectOption: DropdownOptionSelectHandler<T>,
    closeDropdown: MouseEventHandler,
    isFetching?: boolean,
    options?: DropdownOption<T>[],
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

        return options.map(option => (
            <li 
                key={option.text} 
                onClick={() => selectOption(option)}
            >
                {option.text}
            </li>
        ));
    }();

    useEffect(() => {
        function triggerCloseDropdown(e: Event) {
            const clickTarget = e.target as Element | null;

            if (ddOpenerRef.current && 
                ddOpenerRef.current.contains(clickTarget)
            ) 
                e.stopPropagation();
            
            setTimeout(closeDropdown, 0);
        }

        document.addEventListener('click', 
            triggerCloseDropdown, 
            {capture: true}
        );

        return () => document.removeEventListener('click', 
            triggerCloseDropdown, 
            {capture: true}
        );

    }, [closeDropdown]);

    return <menu className={styles.dd}> 
        {dropdownList} 
    </menu>;
}