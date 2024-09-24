import { ReactNode, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { Button, LinkButton, LoadingButton } from "../../../components/Buttons";
import FormView from "../../../stores/FormView/FormView";
import styles from '../form.module.scss'
import common from '../../../styles/common.module.scss';

function FormWrapper({ view, children }: {
    view: FormView,
    children: ReactNode
}) {

    const navigate = useNavigate();

    useEffect(() => {
        if (view.redirectPath)
            navigate(view.redirectPath);
    }, [view.redirectPath]);

    return <div className={styles.cont}>
        <FormHeading view={view} />

        <FormError view={view} />

        <FormContainer view={view}>
            {children}
        </FormContainer>
    </div>
}

export default observer(FormWrapper);

const FormHeading = observer<{ view: FormView }>(({ view }) => {

    return <h1>
        {view.selectedId && `Edit ${view.store.entityName.toLowerCase()}`}

        {!view.selectedId && `Add a new ${view.store.entityName.toLowerCase()}`}
    </h1>
});

const FormError = observer<{ view: FormView }>(({view}) => {
    const errorRef = useRef<HTMLParagraphElement>(null);

    const errorMessage = view.isError ? 'An error has occurred. Try again later' :
        view.form.validationError ? view.form.validationError : ''

    if (errorMessage)
        errorRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});

    return <p ref={errorRef} className={styles.error}>
        { errorMessage }
    </p>
});

const FormContainer = observer<{ view: FormView, children: ReactNode }>(({view, children}) => {

    return <form className={view.isInitialising ? common.shimmer : ''}>

        {children}

        <FormButtons view={view} />

    </form>
});

const FormButtons = observer<{view: FormView}>(({view}) => {

    const {loadedItem, form, isPending} = view;

    return <div className={styles.btns}>
        <LoadingButton
            color="purple" type="submit"
            onClick={form.onSubmit}
            loading={isPending}
            disabled={form.isDefault || !form.isValid}
        >
            Submit form
        </LoadingButton>

        <Button
            color="dark" type="button"
            disabled={!form.isDirty}
            onClick={form.onReset}>
            Restore form
        </Button>

        {loadedItem && <LinkButton
            color="black" type="button"
            to="../"
        >
            Cancel
        </LinkButton>}
    </div>
});