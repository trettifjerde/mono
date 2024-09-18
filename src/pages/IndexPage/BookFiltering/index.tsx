// import { DropdownOptionSelectHandler } from '../../../utils/uiTypes';
import { observer } from 'mobx-react-lite';
import BookPreviewsView from '../../../stores/previews/BookPreviewsView';
import styles from './index.module.scss';

function BookFiltering({view}: {view: BookPreviewsView})  {

    return (<>
        {/* <div>
            <Select 
                id="authorFilter" 
                placeholder="Type author's name"
                label="Only by selected author"
                options={[]}
                selectOption={() => {}}
             />
        </div> */}

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
