import { useContext } from "react";
import { useParams } from "react-router-dom";
import { RootStoreContext } from "../../stores/StoreContext";
import { Pathnames } from "../../utils/consts";
import DetailsPage from "../../layouts/DetailsPage";
import AuthorBookGrid from "./AuthorBookGrid";
import styles from './index.module.scss';

export default function AuthorDetailsPage() {
    const {[Pathnames.id]: id} = useParams() as {[Pathnames.id]: string};
    const {detailsView} = useContext(RootStoreContext).authors;

    detailsView.prepareItem(id);
    
    return <DetailsPage view={detailsView} className={styles.author}>

        <AuthorBookGrid view={detailsView}/>
        
    </DetailsPage>
}