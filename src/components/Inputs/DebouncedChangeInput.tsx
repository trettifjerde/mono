import { ChangeEventHandler, forwardRef, InputHTMLAttributes, memo, useEffect, useImperativeHandle, useRef } from 'react';
import { getCleanValue } from '../../utils/helpers';
import { InputWithIconButton } from '.';

export type InputControlProps = InputHTMLAttributes<HTMLInputElement> & {
    id: string,
    placeholder: string,
    onChange: (value: string) => void,
    timeout?: number,
    onCancel?: () => void
}

const DebouncedChangeInput = forwardRef<HTMLInputElement, InputControlProps>(
    ({id, onChange, onCancel, timeout=250, ...props}, ref) => {

    const timer = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedOnChange : ChangeEventHandler<HTMLInputElement> = (e) => {
        clearTimeout(timer.current);

        timer.current = setTimeout(() => {
            onChange(getCleanValue(e.target));
            timer.current = null;
        }, timeout);
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

    return <InputWithIconButton 
        {...props}
        id={id}
        required
        ref={inputRef}
        color='light'
        onChange={debouncedOnChange}
        onBtnClick={cancelInput}
    /> 
})

export default memo(DebouncedChangeInput);