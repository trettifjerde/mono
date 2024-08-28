import { IndexPageTab } from '../../../utils/types';

export default function Sorting({tab}: {tab: IndexPageTab}) {
    console.log('Sorting, tab now:', tab);
    
    return (<div>
        <label>Sort by</label>
        <input type="text" readOnly placeholder="Select type" />
    </div>)
}