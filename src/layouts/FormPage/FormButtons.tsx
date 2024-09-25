
import { observer } from 'mobx-react-lite';
import { Button, LinkButton, LoadingButton } from '../../components/Buttons';
import FormView from '../../stores/FormView/FormView';
import styles from './form.module.scss';

function FormButtons({view}: {view: FormView}) {

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
}

export default observer(FormButtons);