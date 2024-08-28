import { Link } from "react-router-dom";
import { PATHNAMES } from "../../utils/consts";
import Cart from "./Cart";
import styles from './Navigation.module.scss';

export default function Navigation() {
    return (<nav className={styles.nav}>
        <div>
            <Link to={PATHNAMES.index}>Logo</Link>
        </div>
        <Cart />
    </nav>);
}