import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/Buttons";
import { AuthorFieldNames } from "../../../stores/FormView/configs/authorConfig";
import AuthorFormView from "../../../stores/FormView/AuthorFormView";
import FormWrapper from "../common/FormWrapper";
import InputComponent from "../common/InputComponent";
import ImageComponent from "../common/ImageComponent";
import BooksComponent from "./BooksComponent";
import ButtonsWrapper from "../common/ButtonsWrapper";

function AuthorFormPage({ view }: { view: AuthorFormView }) {

    const navigate = useNavigate();
    
    if (view.submittedItemPath)
        navigate(view.submittedItemPath);
    
    const form = view.form;

    return <FormWrapper view={view}>

        <InputComponent
            field={form.$(AuthorFieldNames.name)}
            isRequired={true}
        />

        <ImageComponent
            field={form.$(AuthorFieldNames.img)}
        />

        <InputComponent
            field={form.$(AuthorFieldNames.bio)}
            isTextarea
        />

        <BooksComponent
            field={form.$(AuthorFieldNames.books)}
            view={view}
        />

        <ButtonsWrapper>
            <Button
                color="light" type="submit"
                onClick={form.onSubmit}
                disabled={!form.isValid}
            >
                Submit
            </Button>
            <Button color="dark" type="button" onClick={form.onReset}>Reset</Button>
        </ButtonsWrapper>
    </FormWrapper>
}

export default observer(AuthorFormPage);