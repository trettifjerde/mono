import { useRouteError } from "react-router-dom";
import RootWrapper from "../RootWrapper";
import styles from './index.module.scss';
import { LinkButton } from "../../../components/Buttons";

export default function ErrorElement() {
    const error = useRouteError() as Error;
  
    return <RootWrapper>
        <div className={styles.err}>
            <section>
                <h1>Oops!</h1>
                <p>{error.message || 'An error has occurred'}</p>
                <LinkButton to="/" relative="path" color="dark">
                    Back to main page
                </LinkButton>
            </section>
        </div>
    </RootWrapper>;
}