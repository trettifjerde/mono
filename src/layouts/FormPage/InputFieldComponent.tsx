import { Field } from "mobx-react-form";
import { observer } from "mobx-react-lite";
import styles from './form.module.scss'
import { MouseEventHandler, ReactNode } from "react";
import { InputWithIconButton } from "../../components/Inputs";

function InputComponent({ field, isTextarea, isRequired, onBtnClick=() => field.set(field.initial), children }: { 
    field: Field, 
    isTextarea?: boolean,
    isRequired?: boolean,
    onBtnClick?: MouseEventHandler<HTMLButtonElement>,
    children?: ReactNode
}) {

    const className = `${styles.colspan} ${(field.validated && !field.isValid)? styles.invalid : ''}`;

    return <div className={styles.group}>

        <label htmlFor={field.id}>
            <span>{field.label}</span>
            {!isRequired && <span>(optional)</span>}
        </label>

        <p>{field.error}</p>

        {isTextarea && <textarea 
            className={className}
            {...field.bind()} 
        />}

        {!isTextarea && <InputWithIconButton
            id={field.id}
            className={className} 
            onBtnClick={onBtnClick}
            {...field.bind()}
        />}

        {children}
    </div>
}

export default observer(InputComponent)