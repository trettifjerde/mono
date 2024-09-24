import { useContext } from "react";
import { useParams } from "react-router-dom";
import { RootStoreContext } from "../../stores/StoreContext";
import { Pathnames } from "../../utils/consts";
import DetailsPage from "../../layouts/DetailsPage";
import BookDetails from "./BookDetails";
import styles from './index.module.scss';

export default function BookDetailsPage() {
    const {[Pathnames.id]: id} = useParams() as {[Pathnames.id]: string};
    const {detailsView} = useContext(RootStoreContext).books;

    detailsView.prepareItem(id);
    
    return <DetailsPage view={detailsView} className={styles.book}>
        <BookDetails view={detailsView}/>
    </DetailsPage>
};