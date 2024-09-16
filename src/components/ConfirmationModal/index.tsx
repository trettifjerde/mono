import { ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from './index.module.scss';
import { Button } from "../Buttons";

export default function ConfirmationModal({children, confirm, close}: {
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
                <Button color="blue" onClick={confirm}>Yes, I am</Button>
                <Button color="black" onClick={close}>Cancel</Button>
            </div>
        </div>
    </div>, 
    document.body);
}