import { ReactNode, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Button, LinkButton, LoadingButton } from "../../components/Buttons";
import FormView from "../../stores/FormView/FormView";
import styles from './form.module.scss'
import common from '../../styles/common.module.scss';

function FormPage({ view, children }: {
    view: FormView,
    children: ReactNode
}) {

    return <div className={styles.cont}>
        <FormHeading view={view} />

        <FormError view={view} />

        <FormWrapper view={view}>
            {children}
        </FormWrapper>
    </div>
}

export default observer(FormPage);

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

const FormWrapper = observer<{ view: FormView, children: ReactNode }>(({view, children}) => {

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