import { useContext } from "react";
import { useParams } from "react-router-dom";
import { RootStoreContext } from "../../stores/StoreContext";
import { Pathnames } from "../../utils/consts";
import DetailsPage from "../../layouts/DetailsPage";
import AuthorBookGrid from "./AuthorBookGrid";
import styles from './index.module.scss';

export default function AuthorDetailsPage() {
    const {[Pathnames.authorId]: authorId} = useParams() as {[Pathnames.authorId]: string};
    const {details} = useContext(RootStoreContext).authors;

    details.prepareItem(authorId);
    
    return <DetailsPage 
        details={details}
        className={styles.author}
    >
        <AuthorBookGrid details={details}/>
        
    </DetailsPage>
}