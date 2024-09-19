import { MouseEventHandler, RefObject, useEffect } from 'react';
import { DropdownOption, DropdownOptionSelectHandler } from '../../utils/uiTypes';
import { LoadingState } from '../../utils/consts';
import styles from './index.module.scss';

export default function Dropdown<T extends string>({
    ddOpenerRef, selectOption, closeDropdown, options, countFromParent=false, state=LoadingState.idle
}: {
    ddOpenerRef: RefObject<HTMLElement>,
    options: DropdownOption<T>[],
    selectOption: DropdownOptionSelectHandler<T>,
    closeDropdown: MouseEventHandler,
    state?: LoadingState
    countFromParent?: boolean,
}) {

    const dropdownList = function(){

        switch (state) {
            case LoadingState.loading:
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
            const clickTarget = e.target as Element | null;

            if (ddOpenerRef.current) { 
                const opener = countFromParent ? ddOpenerRef.current.parentElement! : ddOpenerRef.current;
                
                if (opener.contains(clickTarget))
                    e.stopPropagation();
            }
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
    </menu>
}