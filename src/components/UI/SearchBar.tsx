import { ChangeEventHandler, useEffect, useRef } from 'react';
import styles from './SearchBar.module.scss';

export type SearchBarProps = {
    placeholder: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
    className?: string
}

export default function SearchBar ({placeholder, onChange, className=''}: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const clearInput = () => {
        if (inputRef.current)
            inputRef.current.value = '';
    };

    useEffect(() => {
        clearInput();
    }, [placeholder]);

    return (<div className={`${styles.bar} ${className}`}>
        <input 
            ref={inputRef} type="text" 
            placeholder={placeholder}
            onChange={onChange}
        />
        <button type="button" className='btn-light' onClick={clearInput}>
            <i className='icon-cross' />
        </button>
    </div>)
}