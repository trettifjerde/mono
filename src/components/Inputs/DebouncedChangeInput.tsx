import { ChangeEventHandler, useEffect, useRef } from "react";
import { InputWithIconButton } from ".";
import { getCleanValue } from "../../utils/helpers";

export default function DebouncedChangeInput({id, applyValue, entityTitleName, className, timeout=350}: {
    id: string,
    applyValue: (value: string) => void,
    entityTitleName: string,
    className?: string,
    timeout?: number,
}) {  
    
    const timer = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedOnChange : ChangeEventHandler<HTMLInputElement> = (e) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => applyValue(getCleanValue(e.target)), timeout);
    }

    const clearInput = () => {
        if (inputRef.current) {
            clearTimeout(timer.current);
            inputRef.current.value = '';
            applyValue('');
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
        onChange={debouncedOnChange}
        onBtnClick={clearInput}
    />

}