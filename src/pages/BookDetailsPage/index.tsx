import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../stores/StoreContext";
import ItemLoaderPage from "../../layouts/ItemLoaderPage";
import BookDetailsView from "../../stores/DetailsView/BookDetailsView";
import DetailsPage from "../../layouts/DetailsPage";
import styles from './index.module.scss';

export default function BookDetailsPage() {

    const {detailsView} = useContext(RootStoreContext).books;

    return <ItemLoaderPage view={detailsView}>
        <BookDetails view={detailsView} />
    </ItemLoaderPage>
};

const BookDetails = observer<{view: BookDetailsView}>(({view}) => {
    
    return <DetailsPage view={view} className={styles.book}>
        <BookPrice view={view}/>
    </DetailsPage>
})

const BookPrice = observer<{view: BookDetailsView}>(({view}) => {
    
    const info = view.loadedItem?.preview;

    if (!info)
        return <></>

    return <div className={styles.info}>
        <p>{info.price} €</p>
        <span>({info.inStock} in stock)</span>
    </div>
})