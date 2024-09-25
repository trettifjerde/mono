import { observer } from 'mobx-react-lite';
import BookPreviewsView from '../../../stores/PreviewsView/BookPreviewsView';
import DynamicSelect from '../../../components/DynamicSelect';
import styles from './index.module.scss';

function BookFiltering({view}: {view: BookPreviewsView})  {

    return (<>
        <div className={styles.filter}>
            <label htmlFor="authorName">
                <i className='icon-author' />
                <span>Filter by author</span>
            </label>
            
            <DynamicSelect 
                id="authorName"
                placeholderWord="author name"
                settings={view.authorSettings}
            />
        </div>

        <div className={styles.chbx}>
            <label htmlFor="inStock">
                <i className='icon-basket' />
                <span>Currently in stock</span>
            </label>
            <input 
                id="inStock" type="checkbox" 
                defaultChecked={view.inStockFilter} 
                onChange={e => view.setInStockFilter(e)}
            />
        </div>
    </>
    )
};

export default observer(BookFiltering);
