import { observer } from "mobx-react-lite";
import BookSlice from "../../../stores/slices/BookSlice";
import { TextIconButton } from "../../../components/Buttons";
import styles from './index.module.scss';

function BookDetails({details}: {details: BookSlice['details']}) {
    
    const info = details.loadedItem?.fullInfo;

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