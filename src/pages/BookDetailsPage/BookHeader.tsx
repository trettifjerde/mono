import { Link } from "react-router-dom";
import { makeAbsolutePath } from "../../utils/helpers";
import { Pathnames } from "../../utils/consts";
import Book from "../../utils/classes/Book";
import common from '../../styles/common.module.scss';

export default function BookHeader({item}: {item: Book | null}) {

    return <h5>
        {item && item.authorInfo &&  <Link 
            to={makeAbsolutePath(Pathnames.authors, item.authorInfo.id)} 
            className={common.link}
        >
            {item.authorInfo.name}
        </Link>}

        {item && !item.authorInfo && 'unknown author'}
    </h5>
};