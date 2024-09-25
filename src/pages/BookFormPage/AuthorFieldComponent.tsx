import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import DynamicSelect from "../../components/DynamicSelect";
import AuthorField from "../../stores/FormView/fields/AuthorField";
import formStyles from '../../layouts/FormPage/form.module.scss';

function AuthorComponent({ field }: { field: AuthorField }) {

    const {authorSettings} = field;
    
    useEffect(() => {
        return () => authorSettings.resetSettings();
    }, []);

    return <>
        <div className={formStyles.group}>

            <label htmlFor={field.id}>
                {field.label}
            </label>

            <p>{field.error}</p>

            <DynamicSelect
                id={field.id}
                placeholderWord="author name"
                settings={authorSettings}
                className={formStyles.span}
            />
        </div>
    </>
}

export default observer(AuthorComponent);