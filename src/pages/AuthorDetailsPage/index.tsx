import { useContext } from "react";
import { useParams } from "react-router-dom";
import { RootStoreContext } from "../../stores/StoreContext";
import { DefaultBookImgSrc, Pathnames } from "../../utils/consts";
import DetailsWrapper from "../../layouts/Details/DetailsWrapper";
import AuthorBookGrid from "./AuthorBookGrid";
import styles from './index.module.scss';

export default function AuthorDetailsPage() {
    const {[Pathnames.authorId]: itemId} = useParams() as {[Pathnames.authorId]: string};
    const {details} = useContext(RootStoreContext).authors;
    
    return <DetailsWrapper 
        currentId={itemId}
        details={details}
        className={styles.author}
        fallbackImg={DefaultBookImgSrc}
    >
        <AuthorBookGrid details={details}/>
    </DetailsWrapper>
}