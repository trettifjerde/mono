import { observer } from "mobx-react-lite";
import Book from "../../utils/classes/Book";
import BookForm, { BookFormFields as BFF} from "../../stores/FormView/forms/BookForm";
import FormView from "../../stores/FormView/FormView";
import FormWrapper from "../../layouts/FormPage/FormWrapper";
import InputComponent from "../../layouts/FormPage/InputFieldComponent";
import ImageComponent from "../../layouts/FormPage/ImageFieldComponent";
import AuthorComponent from "./AuthorFieldComponent";
import styles from './book.module.scss';

function BookFormComponent({ view }: { view: FormView<Book, BookForm>}) {
    
    const form = view.form;

    return <FormWrapper view={view}>

        <InputComponent
            field={form.$(BFF.title)}
            isRequired={true}
        />

        <AuthorComponent field={form.$(BFF.author)} />
        
        <ImageComponent
            field={form.$(BFF.img)}
        />

        <div className={styles.numbers}>
            <InputComponent 
                field={form.$(BFF.price)}
                isRequired={true}
            />
            <InputComponent 
                field={form.$(BFF.inStock)}
                isRequired={true}
            />
        </div>

        <InputComponent
            field={form.$(BFF.description)}
            isTextarea
        />
    </FormWrapper>
}

export default observer(BookFormComponent);