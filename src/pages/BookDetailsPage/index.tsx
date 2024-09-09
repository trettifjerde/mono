import { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../stores/StoreContext";
import Book from "../../utils/classes/Book";
import { DefaultBookImgSrc, Pathnames } from "../../utils/consts";
import { makeAbsolutePath } from "../../utils/helpers";
import DetailsWrapper from "../../layouts/Details/DetailsWrapper";
import BookDetails from "./BookDetails";
import styles from './index.module.scss';

export default function BookDetailsPage() {
    const {[Pathnames.bookId]: bookId} = useParams() as {[Pathnames.bookId]: string};
    const {details} = useContext(RootStoreContext).books;
    
    return <DetailsWrapper 
        currentId={bookId}
        details={details}
        className={styles.book}
        fallbackImg={DefaultBookImgSrc}
        HeaderComponent={BookHeader}
    >
        <BookDetails details={details}/>
    </DetailsWrapper>
};

const BookHeader = observer(({item}: {item: Book | null}) => {
    const info = item?.fullInfo;

    return <h5>
        {info && <Link 
            to={makeAbsolutePath(Pathnames.authors, info.authorId)} 
            relative="path"
            className="link"
        >
            {info.authorName}
        </Link>}
    </h5>
});