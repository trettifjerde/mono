import { Link } from "react-router-dom";
import { Pathnames } from "../../utils/consts";
import { makeAbsolutePath } from "../../utils/helpers";
import styles from './root.module.scss';

export default function Navigation() {
    return (<nav className={styles.nav}>
        <ul>
            <li>
                <Link to="/">
                    <i className="icon-books" />
                </Link>
            </li>
            <li>
                <Link to={makeAbsolutePath(Pathnames.authors)}>
                    <i className="icon-author" />
                </Link>
            </li>
        </ul>
    </nav>);
}