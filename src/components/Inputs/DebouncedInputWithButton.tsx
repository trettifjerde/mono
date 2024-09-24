import { ChangeEventHandler, forwardRef, MouseEventHandler, useEffect, useRef } from "react";
import { InputWithIconButton } from ".";

type DebouncedInputProps = {
    id: string,
    placeholderWord: string,
    readOnly?: boolean,
    defaultValue?: string,
    className?: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
    onBtnClick: MouseEventHandler<HTMLButtonElement>,
    onClick?: MouseEventHandler<HTMLInputElement>,
    timeout?: number,
};

const DebouncedInputWithButton = forwardRef<HTMLInputElement, DebouncedInputProps>(({
    id, placeholderWord, readOnly, defaultValue,
    onChange, onBtnClick, onClick, 
    className, timeout=350
}, ref) => {  
    
    const timer = useRef<any>(null);

    const debouncedOnChange : ChangeEventHandler<HTMLInputElement> = (e) => {
        clearTimeout(timer.current);

        timer.current = setTimeout(() => onChange(e), timeout);
    }

    const debouncedOnBtnClick : MouseEventHandler<HTMLButtonElement> = (e) => {
        clearTimeout(timer.current);
        onBtnClick(e);
    }

    useEffect(() => {
        return () => clearTimeout(timer.current);
    }, [])

    return <InputWithIconButton 
        id={id}
        ref={ref}
        className={className}
        placeholder={`Start typing ${placeholderWord}...`}
        readOnly={readOnly}
        defaultValue={defaultValue}
        onChange={debouncedOnChange}
        onBtnClick={debouncedOnBtnClick}
        onClick={onClick}
    />
})

export default DebouncedInputWithButton;