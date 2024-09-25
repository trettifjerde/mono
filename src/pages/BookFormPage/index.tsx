import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../stores/StoreContext";
import Book from "../../utils/classes/Book";
import BookForm, { BookFormFields as BFF} from "../../stores/FormView/forms/BookForm";
import FormView from "../../stores/FormView/FormView";
import ItemLoaderPage from "../../layouts/ItemLoaderPage";
import FormPage from "../../layouts/FormPage";
import InputFieldComponent from "../../layouts/FormPage/InputFieldComponent";
import ImageFieldComponent from "../../layouts/FormPage/ImageFieldComponent";
import AuthorFieldComponent from "./AuthorFieldComponent";
import styles from './book.module.scss';

export default function BookFormPage() {

    const {formView} = useContext(RootStoreContext).books;

    return <ItemLoaderPage view={formView} >
        <BookFormComponent view={formView} />
    </ItemLoaderPage>
    
}

const BookFormComponent = observer<{ view: FormView<Book, BookForm>}>(({view}) => {
    
    const form = view.form;

    return <FormPage view={view}>

        <InputFieldComponent
            field={form.$(BFF.title)}
            isRequired={true}
        />

        <AuthorFieldComponent field={form.$(BFF.author)} />
        
        <ImageFieldComponent
            field={form.$(BFF.img)}
        />

        <div className={styles.numbers}>
            <InputFieldComponent 
                field={form.$(BFF.price)}
                isRequired={true}
            />
            <InputFieldComponent
                field={form.$(BFF.inStock)}
                isRequired={true}
            />
        </div>

        <InputFieldComponent
            field={form.$(BFF.description)}
            isTextarea
        />
    </FormPage>
});