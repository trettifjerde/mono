import { Link } from "react-router-dom";
import { makeAbsolutePath } from "../../utils/helpers";
import { Pathnames } from "../../utils/consts";
import Book from "../../utils/classes/Book";
import common from '../../styles/common.module.scss';

export default function BookHeader({item}: {item: Book | null}) {

    const info = item?.authorInfo;

    return <h5>
        {info &&  <Link 
            to={makeAbsolutePath(Pathnames.authors, info.authorId)} 
            relative="path"
            className={common.link}
        >
            {info.authorName}
            
        </Link>}
    </h5>
};