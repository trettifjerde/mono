import { useContext } from "react";
import { useParams } from "react-router-dom";
import { RootStoreContext } from "../../stores/StoreContext";
import { Pathnames } from "../../utils/consts";
import DetailsPage from "../../layouts/DetailsPage";
import BookDetails from "./BookDetails";
import styles from './index.module.scss';

export default function BookDetailsPage() {
    const {[Pathnames.bookId]: bookId} = useParams() as {[Pathnames.bookId]: string};
    const {details} = useContext(RootStoreContext).books;

    details.prepareItem(bookId);
    
    return <DetailsPage 
        details={details}
        className={styles.book}
    >
        <BookDetails details={details}/>
        
    </DetailsPage>
};