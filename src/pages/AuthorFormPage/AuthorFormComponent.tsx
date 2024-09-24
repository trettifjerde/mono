import { observer } from "mobx-react-lite";
import Author from "../../utils/classes/Author";
import AuthorForm, { AuthorFormFields as AFF } from "../../stores/FormView/forms/AuthorForm";
import FormView from "../../stores/FormView/FormView";
import FormWrapper from "../../layouts/FormPage/FormWrapper";
import InputFieldComponent from "../../layouts/FormPage/InputFieldComponent";
import ImageFieldComponent from "../../layouts/FormPage/ImageFieldComponent";
import BooksFieldComponent from "./BooksFieldComponent";

function AuthorFormPageComponent({ view }: { view: FormView<Author, AuthorForm>}) {
    
    const form = view.form

    return <FormWrapper view={view}>

        <InputFieldComponent
            field={form.$(AFF.name)}
            isRequired={true}
        />

        <ImageFieldComponent
            field={form.$(AFF.img)}
        />

        <InputFieldComponent
            field={form.$(AFF.bio)}
            isTextarea
        />

        <BooksFieldComponent
            field={form.$(AFF.bookIds)}
        />
        
    </FormWrapper>
}

export default observer(AuthorFormPageComponent);