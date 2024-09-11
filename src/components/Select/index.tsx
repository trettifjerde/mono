import { forwardRef, InputHTMLAttributes, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { DropdownOption, DropdownOptionSelectHandler } from '../../utils/uiTypes';
import Dropdown from '../Dropdown';
import { InputWithIconButton } from '../Inputs';
import styles from './index.module.scss';

type SelectProps = InputHTMLAttributes<HTMLInputElement> & {
    id: string,
    label: string,
    defaultValue?: string,
    options: DropdownOption[],
    selectOption: DropdownOptionSelectHandler
};

const Select = forwardRef<HTMLInputElement, SelectProps>(({
    id, label, defaultValue, options, selectOption, ...props
}, ref) => {

    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const ddOpenerRef = useRef<HTMLInputElement>(null);
    
    const openDropdown = useCallback(() => setDropdownVisible(true), []);
    const cancelSelect = useCallback(() => {
        selectOption(null);
        
    }, [selectOption]);
    
    useImperativeHandle(ref, () => ddOpenerRef.current!, []);

    useEffect(() => {
        if (isDropdownVisible) {
            function closeDropdown(e: Event) {
                const clickTarget = e.target as Element | null;

                if (ddOpenerRef.current && 
                    ddOpenerRef.current.contains(clickTarget)
                ) 
                    e.stopPropagation();
                
                setTimeout(() => setDropdownVisible(false), 0);
            }

            document.addEventListener(
                'click', 
                closeDropdown, 
                {capture: true}
            );

            return () => document.removeEventListener(
                'click', 
                closeDropdown, 
                {capture: true}
            );
        }

    }, [isDropdownVisible, ddOpenerRef]);

    return (<>
        <label htmlFor={id}>{label}</label>
        
        <div className={styles.cont}>
            <InputWithIconButton
                {...props}
                id={id}
                ref={ddOpenerRef}
                defaultValue={defaultValue}
                onClick={openDropdown}
                onBtnClick={cancelSelect}
            />

            {isDropdownVisible && <Dropdown 
                options={options} 
                selectOption={selectOption}
            />}
        </div>
    </>);
})

export default Select;