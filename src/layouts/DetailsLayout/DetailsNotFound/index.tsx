import { useRouteError } from "react-router-dom";
import styles from './index.module.scss';

export default function DetailsNotFound() {
    const error = useRouteError() as Error; 
    
    return <div className={styles.c}>
        {error.message}
    </div>
}