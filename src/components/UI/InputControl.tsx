import { ChangeEventHandler, forwardRef, MouseEventHandler, useEffect, useImperativeHandle, useRef } from 'react';
import styles from './InputControl.module.scss';

export type InputControlProps = {
    id: string,
    placeholder: string,
    onChange: (value: string) => void,
    disabled?: boolean,
    readOnly?: boolean,
    onClick?: MouseEventHandler,
    onCancel?: () => void
}

const InputControl = forwardRef<HTMLInputElement, InputControlProps>(
    ({id, placeholder, onChange, onCancel, readOnly=false, disabled=false, onClick}, ref) => {
    
    const timer = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedOnChange : ChangeEventHandler<HTMLInputElement> = (e) => {
        clearTimeout(timer.current);

        timer.current = setTimeout(() => {
            onChange(getCleanValue(e.target));
            timer.current = null;
        }, 250);
    }

    const clearInput = () => {
        if (inputRef.current)
            inputRef.current.value = '';
    };

    const cancelInput = () => {
        clearTimeout(timer.current);
        clearInput();
        if (onCancel)
            onCancel();
    }

    useImperativeHandle(ref, () => inputRef.current!, []);

    useEffect(() => {
        clearInput();
        clearTimeout(timer.current);
    }, [id]);

    useEffect(() => {
        return () => clearTimeout(timer.current);
    }, []);

    return (<div className={styles.bar}>
        <input 
            id={id}
            required
            ref={inputRef}
            type="text" 
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
            onClick={onClick}
            onChange={debouncedOnChange}
        />
        <button type="button" onClick={cancelInput}>
            <i className='icon-cross' />
        </button>
    </div>)
});

export default InputControl;

function getCleanValue(input: HTMLInputElement) {
    return input.value.trim().toLowerCase();
}