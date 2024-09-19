import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import AuthorFormView from "../../../stores/FormView/AuthorFormView"
import styles from './form.module.scss'
import common from '../../../styles/common.module.scss'

function FormWrapper({view, children}: {
    view: AuthorFormView,
    children: ReactNode
}) {
    return <div className={`${styles.cont} ${view.isLoading ? common.shimmer : ''}`}>
        <h1>Add a new {view.store.entityName.toLowerCase()}</h1>

        <form>
            <p className={styles.error}>
                {(view.isError ) && 'An error has occurred. Try again later'}
            </p>
            {children}
        </form>
    </div>
}

export default observer(FormWrapper)