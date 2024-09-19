import { Field } from "mobx-react-form";
import { observer } from "mobx-react-lite";
import styles from './form.module.scss'

function InputComponent({ field, isTextarea, isRequired }: { 
    field: Field, 
    isTextarea?: boolean,
    isRequired?: boolean 
}) {

    const className = field.validated && !field.isValid ? styles.invalid : '';

    return <div className={styles.group}>
        <label htmlFor={field.id}>
            <span>{field.label}</span>
            {!isRequired && <span className={styles.gray}>(optional)</span>}
        </label>
        <p>{field.error}</p>

        {isTextarea && <textarea 
            {...field.bind()} 
            className={className}
        />}
        {!isTextarea && <input
            {...field.bind()}
            className={className} 
        />}
    </div>
}

export default observer(InputComponent)