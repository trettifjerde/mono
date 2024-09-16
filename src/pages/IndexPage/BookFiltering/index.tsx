// import { DropdownOptionSelectHandler } from '../../../utils/uiTypes';
import { observer } from 'mobx-react-lite';
import styles from './index.module.scss';
import BookGrid from '../../../stores/grid/BookGrid';

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
            <label htmlFor="inStock">
                <i className='icon-basket' />
                <span>
                    Currently in stock
                </span>
                </label>
            <input 
                id="inStock" type="checkbox" 
                defaultChecked={false} 
                onChange={applyInStockFilter}
            />
        </div>
    </>
    )
};

export default observer(BookFiltering);
