import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../stores/StoreContext";
import ItemLoaderPage from "../../layouts/ItemLoaderPage";
import AuthorDetailsView from "../../stores/DetailsView/AuthorDetailsView";
import DetailsPage from "../../layouts/DetailsPage";
import PreviewGrid from "../../components/PreviewGrid";
import BookPreview from "../../components/BookPreview";
import styles from './index.module.scss';

export default function AuthorDetailsPage() {
    const {detailsView} = useContext(RootStoreContext).authors;
    
    return <ItemLoaderPage view={detailsView}>
        <AuthorDetails view={detailsView} />
    </ItemLoaderPage>
}

const AuthorDetails = observer<{view: AuthorDetailsView}>(({view}) => {
    return <DetailsPage 
        view={view} 
        className={styles.author}
    >
        <AuthorBookGrid view={view}/>
    </DetailsPage>
});

const AuthorBookGrid = observer<{view: AuthorDetailsView}>(({view}) => {

    return <PreviewGrid
        isLoading={view.isInitialising}
        items={view.books}
        itemName={view.store.rootStore.books.entityName}
        ItemPreview={BookPreview} 
    />
});