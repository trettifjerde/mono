import { ChangeEventHandler, forwardRef, MouseEventHandler, useEffect, useImperativeHandle, useRef } from "react";
import { InputWithIconButton } from ".";
import { getCleanValue } from "../../utils/helpers";

type DebouncedInputProps = {
    id: string,
    applyValue: (value: string) => void,
    entityTitleName: string,
    onClick?: () => void,
    className?: string,
    timeout?: number,
};

const DebouncedInput = forwardRef<HTMLInputElement, DebouncedInputProps>(({
    id, applyValue, onClick, entityTitleName, className, timeout=350
}, ref) => {  
    
    const timer = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!, []);

    const debouncedOnChange : ChangeEventHandler<HTMLInputElement> = (e) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => applyValue(getCleanValue(e.target)), timeout);
    }

    const clearInput : MouseEventHandler = (e) => {
        if (inputRef.current) {
            clearTimeout(timer.current);
            e.stopPropagation();
            
            applyValue('');
            inputRef.current.value = '';
        }
    }

    useEffect(() => {
        return () => clearTimeout(timer.current);
    }, [])

    return <InputWithIconButton 
        id={id}
        ref={inputRef}
        className={className}
        placeholder={`Start typing ${entityTitleName}...`}
        onClick={onClick}
        onChange={debouncedOnChange}
        onBtnClick={clearInput}
    />
})

export default DebouncedInput;