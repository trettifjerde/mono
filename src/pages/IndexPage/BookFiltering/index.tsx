// import { DropdownOptionSelectHandler } from '../../../utils/uiTypes';
import { observer } from 'mobx-react-lite';
import styles from './index.module.scss';
import BookGrid from '../../../stores/Grid/BookGrid';

function BookFiltering({grid}: {grid: BookGrid})  {

    const {applyInStockFilter} = grid;

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
            <label htmlFor="inStock">Currently in stock</label>
            <input 
                id="inStock" type="checkbox" 
                defaultChecked={false} 
                onChange={(e) => applyInStockFilter(e.target.checked)}
            />
        </div>
    </>
    )
};

export default observer(BookFiltering);
