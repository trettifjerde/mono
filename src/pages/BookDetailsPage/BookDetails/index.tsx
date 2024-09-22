import { observer } from "mobx-react-lite";
import { TextIconButton } from "../../../components/Buttons";
import BookDetailsView from "../../../stores/DetailsView/BookDetailsView";
import styles from './index.module.scss';

function BookDetails({view}: {view: BookDetailsView}) {
    
    const info = view.loadedItem?.preview || null;

    if (!info)
        return <></>

    return <div className={styles.info}>
        <p className={styles.price}>{info.price} €</p>
        <span className={styles.stock}>({info.inStock} in stock)</span>

        <TextIconButton 
            className={styles.buy} 
            disabled={!info.inStock}
            icon="icon-cart"
            text="Buy"
        />
    </div>
}

export default observer(BookDetails);