import { useContext } from "react";
import { useParams } from "react-router-dom";
import { RootStoreContext } from "../../stores/StoreContext";
import { Pathnames } from "../../utils/consts";
import DetailsPage from "../../layouts/DetailsPages";
import AuthorBookGrid from "./AuthorBookGrid";
import styles from './index.module.scss';

export default function AuthorDetailsPage() {
    const {[Pathnames.authorId]: authorId} = useParams() as {[Pathnames.authorId]: string};
    const {detailsView} = useContext(RootStoreContext).authors;

    detailsView.prepareItem(authorId);
    
    return <DetailsPage 
        view={detailsView}
        className={styles.author}
    >
        <AuthorBookGrid view={detailsView}/>
        
    </DetailsPage>
}