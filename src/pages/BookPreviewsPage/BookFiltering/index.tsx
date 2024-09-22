import { observer } from 'mobx-react-lite';
import BookPreviewsView from '../../../stores/PreviewsView/BookPreviewsView';
import DynamicSelect from '../../../components/DynamicSelect';
import styles from './index.module.scss';

function BookFiltering({view}: {view: BookPreviewsView})  {

    return (<>
        <DynamicSelect 
            id="authorName"
            icon='icon-author'
            label="Filter by author"
            entityTitleName="author name"
            settings={view.authorSettings}
        />

        <div className={styles.chbx}>
            <label htmlFor="inStock">
                <i className='icon-basket' />
                <span>Currently in stock</span>
            </label>
            <input 
                id="inStock" type="checkbox" 
                defaultChecked={view.inStockFilter} 
                onChange={view.setInStockFilter}
            />
        </div>
    </>
    )
};

export default observer(BookFiltering);
