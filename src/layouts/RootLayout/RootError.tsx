import { useRouteError } from "react-router-dom";
import { LinkButton } from "../../components/Buttons";
import RootWrapper from "./RootWrapper";
import styles from './root.module.scss';

export default function ErrorElement() {
    const error = useRouteError() as Error;
  
    return <RootWrapper>
        <div className={styles.error}>
            <section>
                <h1>Oops!</h1>
                <p>{error.message || 'An error has occurred'}</p>
                <LinkButton to="/" color="dark">
                    Back to main page
                </LinkButton>
            </section>
        </div>
    </RootWrapper>;
}