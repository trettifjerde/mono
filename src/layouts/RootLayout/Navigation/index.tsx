import { Link } from "react-router-dom";
import styles from './index.module.scss';
import { makeAbsolutePath } from "../../../utils/helpers";
import { Pathnames } from "../../../utils/consts";

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