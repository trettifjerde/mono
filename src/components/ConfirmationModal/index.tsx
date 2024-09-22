import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button, LoadingButton } from "../Buttons";
import styles from './index.module.scss';
import { observer } from "mobx-react-lite";

function ConfirmationModal({ isPending, children, confirm, close}: {
    isPending: boolean,
    children: ReactNode,
    confirm: () => void,
    close: () => void
}) {

    return createPortal(<div className={styles.modal}>
        <div className={styles.backdrop} onClick={close}/>
        <div className={styles.inner}>
            <div className={styles.message}>
                {children}
            </div>
            <div className={styles.btns}>
                <LoadingButton 
                    type="button"
                    color="blue" 
                    disabled={isPending}
                    loading={isPending}
                    onClick={confirm}
                >
                    Yes, I am
                </LoadingButton>
                <Button type="button" color="black" onClick={close}>Cancel</Button>
            </div>
        </div>
    </div>, 
    document.body);
}

export default observer(ConfirmationModal);