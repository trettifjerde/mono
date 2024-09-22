import { observer } from "mobx-react-lite";
import { AuthorFieldNames as AFN } from "../../../stores/FormView/forms/AuthorForm";
import { Button } from "../../../components/Buttons";
import AuthorFormView from "../../../stores/FormView/AuthorFormView";
import FormWrapper from "../common/FormWrapper";
import InputComponent from "../common/InputComponent";
import ImageComponent from "../common/ImageComponent";
import BooksComponent from "./BooksComponent";
import ButtonsWrapper from "../common/ButtonsWrapper";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthorFormPage({ view }: { view: AuthorFormView}) {
    
    const navigate = useNavigate();
    const form = view.form;

    useEffect(() => {
        if (view.redirectPath)
            navigate(view.redirectPath);
    }, [view.redirectPath])

    return <FormWrapper view={view}>

        <InputComponent
            field={form.$(AFN.name)}
            isRequired={true}
        />

        <ImageComponent
            field={form.$(AFN.img)}
        />

        <InputComponent
            field={form.$(AFN.bio)}
            isTextarea
        />

        <BooksComponent
            field={form.$(AFN.bookIds)}
        />

        <ButtonsWrapper>
            <Button
                color="light" type="submit"
                onClick={form.onSubmit}
                disabled={form.isDefault || !form.isValid}
            >
                Submit
            </Button>
            <Button color="dark" type="button" onClick={form.onReset}>Reset</Button>
        </ButtonsWrapper>
    </FormWrapper>
}

export default observer(AuthorFormPage);