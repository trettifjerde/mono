import { ChangeEventHandler, forwardRef, MouseEventHandler, useEffect, useRef } from "react";
import { InputWithIconButton } from ".";

type DebouncedInputProps = {
    id: string,
    entityTitleName: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
    onBtnClick: MouseEventHandler<HTMLButtonElement>,
    defaultValue?: string,
    onClick?: MouseEventHandler<HTMLInputElement>,
    className?: string,
    timeout?: number,
};

const DebouncedInputWithButton = forwardRef<HTMLInputElement, DebouncedInputProps>(({
    id, onChange, onBtnClick, onClick, defaultValue, entityTitleName, className, timeout=350
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
        placeholder={`Start typing ${entityTitleName}...`}
        defaultValue={defaultValue}
        onChange={debouncedOnChange}
        onBtnClick={debouncedOnBtnClick}
        onClick={onClick}
    />
})

export default DebouncedInputWithButton;