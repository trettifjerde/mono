import { useContext } from "react";
import { useParams } from "react-router-dom";
import { RootStoreContext } from "../../stores/StoreContext";
import { Pathnames } from "../../utils/consts";
import DetailsPage from "../../layouts/DetailsPages";
import BookDetails from "./BookDetails";
import styles from './index.module.scss';

export default function BookDetailsPage() {
    const {[Pathnames.bookId]: bookId} = useParams() as {[Pathnames.bookId]: string};
    const {detailsView} = useContext(RootStoreContext).books;

    detailsView.prepareItem(bookId);
    
    return <DetailsPage 
        view={detailsView}
        className={styles.book}
    >
        <BookDetails view={detailsView}/>
        
    </DetailsPage>
};