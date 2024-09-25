import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../stores/StoreContext";
import { AuthorFormFields as AFF } from "../../stores/FormView/forms/AuthorForm";
import ItemLoaderPage from "../../layouts/ItemLoaderPage";
import FormView from "../../stores/FormView/FormView";
import Author from "../../utils/classes/Author";
import AuthorForm from "../../stores/FormView/forms/AuthorForm";
import FormPage from "../../layouts/FormPage";
import InputFieldComponent from "../../layouts/FormPage/InputFieldComponent";
import ImageFieldComponent from "../../layouts/FormPage/ImageFieldComponent";
import BooksFieldComponent from "./BooksFieldComponent";

export default function AuthorFormPage() {

    const { formView } = useContext(RootStoreContext).authors;

    return <ItemLoaderPage view={formView}>
        <AuthorFormComponent view={formView} />
    </ItemLoaderPage>
}

const AuthorFormComponent = observer<{view: FormView<Author, AuthorForm>}>(({view}) => {
    
    const form = view.form

    return <FormPage view={view}>

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
        
    </FormPage>
})