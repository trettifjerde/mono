import { Link } from "react-router-dom";
import { makeAbsolutePath } from "../../utils/helpers";
import { Pathnames } from "../../utils/consts";
import Book from "../../utils/classes/Book";

export default function BookHeader({item}: {item: Book | null}) {

    const info = item?.preview;

    return <h5>
        {info && <Link 
            to={makeAbsolutePath(Pathnames.authors, info.authorId)} 
            relative="path"
            className="link"
        >
            {info.authorName}
            
        </Link>}
    </h5>
};