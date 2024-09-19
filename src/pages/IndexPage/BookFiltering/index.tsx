// import { DropdownOptionSelectHandler } from '../../../utils/uiTypes';
import { observer } from 'mobx-react-lite';
import BookPreviewsView from '../../../stores/PreviewsView/BookPreviewsView';
import styles from './index.module.scss';
import DynamicSelect from '../../../components/DynamicSelect';

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
                <span>
                    Currently in stock
                </span>
                </label>
            <input 
                id="inStock" type="checkbox" 
                defaultChecked={false} 
                onChange={view.setInStockFilter}
            />
        </div>
    </>
    )
};

export default observer(BookFiltering);
