import { useCallback, useEffect, useReducer, useRef } from 'react';
import { DropdownOption, SelectOptionsConfig } from '../../utils/uiTypes';
import InputControl from '../InputControl';
import styles from './index.module.scss';

export default function Select<T extends DropdownOption>({
    optionsConfig, id, placeholder, label, selectOption
}: Props<T>) {

    const [state, dispatch] = useReducer(reducer<T>, emptyReducer);
    const { isDropdownVisible, isFetching, options } = state;
    const ddOpenerRef = useRef<HTMLInputElement>(null);

    const openDropdown = () => dispatch({type: DropdownActionsType.openDropdown});

    const onInputChange = useCallback(async (filterStr: string) => {
        if (optionsConfig.dynamic) {
            dispatch({ type: DropdownActionsType.startFetching });

            const results = await optionsConfig.getOptions(filterStr);

            dispatch({ type: DropdownActionsType.setOptions, results });
        }
    }, [optionsConfig]);

    const selectDropdownOption = (option: T | null) => {
        if (ddOpenerRef.current)
            ddOpenerRef.current.value = option ? option.text : '';
        
        selectOption(option);

        if (optionsConfig.dynamic) 
            dispatch({type: DropdownActionsType.setOptions, results: null})
    }

    const dropdownList = !isDropdownVisible ? null :
        isFetching ? (<li className={styles.loading}>
            Loading...
        </li>) :
        !options ? null : 
        !options.length ? (
            <li className={styles.empty}>
                No results
            </li>
        ) : options.map(option => (
            <li
                key={option.id}
                onClick={() => selectDropdownOption(option)}
            >
                {option.text}
            </li>)
    );

    useEffect(() => {
        dispatch({ type: DropdownActionsType.init, optionsConfig });
    }, [optionsConfig]);

    useEffect(() => {
        if (isDropdownVisible) {
            function closeDropdown(e: Event) {
                const clickTarget = e.target as Element | null;

                if (ddOpenerRef.current && ddOpenerRef.current.contains(clickTarget)) 
                    e.stopPropagation();
                
                setTimeout(() => dispatch({ type: DropdownActionsType.closeDropdown }), 0);
            }

            document.addEventListener('click', closeDropdown, {capture: true});

            return () => document.removeEventListener('click', closeDropdown, {capture: true});
        }

    }, [isDropdownVisible, dispatch, ddOpenerRef]);

    return (<>
        <label htmlFor={id}>{label}</label>
        
        <div className={styles.cont}>
            <InputControl
                id={id} ref={ddOpenerRef}
                disabled={false}
                readOnly={!optionsConfig.dynamic}
                timeout={400}
                placeholder={placeholder}
                onClick={openDropdown}
                onChange={onInputChange}
                onCancel={() => selectDropdownOption(null)}
            />

            {dropdownList && <menu>{dropdownList}</menu>}
        </div>
    </>);
}

type Props<T extends DropdownOption> = {
    id: string,
    label: string
    placeholder: string,
    optionsConfig: SelectOptionsConfig<T>,
    selectOption: (opt: T | null) => void,
};

function reducer<T extends DropdownOption>(state: DropdownState<T>, action: DropdownAction<T>): DropdownState<T> {
    switch (action.type) {
        case DropdownActionsType.openDropdown:
            return {
                ...state,
                isDropdownVisible: true
            };

        case DropdownActionsType.closeDropdown:
            return {
                ...state,
                isDropdownVisible: false
            };

        case DropdownActionsType.startFetching:
            return {
                ...state,
                isFetching: true,
                isDropdownVisible: true
            }

        case DropdownActionsType.setOptions:
            return {
                ...state,
                isFetching: false,
                isDropdownVisible: true,
                options: action.results
            };

        case DropdownActionsType.init: {
            return initReducer(action.optionsConfig);
        }

        default:
            return state;
    }
}

function initReducer<T extends DropdownOption>(optionsConfig: SelectOptionsConfig<T>): DropdownState<T> {
    return {
        isDropdownVisible: false,
        isFetching: false,
        options: optionsConfig.dynamic ? null : optionsConfig.defaultOptions
    }
}

type DropdownState<T> = {
    isDropdownVisible: boolean,
    isFetching: boolean,
    options: T[] | null
};

enum DropdownActionsType {
    openDropdown,
    closeDropdown,
    startFetching,
    setOptions,
    init
}

type DropdownAction<T extends DropdownOption> = {
    type: DropdownActionsType.openDropdown
} | {
    type: DropdownActionsType.closeDropdown
} | {
    type: DropdownActionsType.startFetching
} | {
    type: DropdownActionsType.setOptions,
    results: T[] | null
} | {
    type: DropdownActionsType.init,
    optionsConfig: SelectOptionsConfig<T>
}

const emptyReducer = {
    isDropdownVisible: false,
    isFetching: false,
    options: null
}