import { Link } from "react-router-dom";
import Cart from "./Cart";
import styles from './index.module.scss';

export default function Navigation() {
    return (<nav className={styles.nav}>
        <ul>
            <li>
                <Link to="">Logo</Link>
            </li>
            <li>
                <Cart />
            </li>
        </ul>
    </nav>);
}