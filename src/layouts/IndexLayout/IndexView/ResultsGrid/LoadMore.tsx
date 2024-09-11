import { observer } from 'mobx-react-lite';
import GridStore from '../../../../stores/Grid/GridStore';
import { DetailsConstraint as DC, PreviewConstraint as PC } from '../../../../utils/classes/Entity';
import { LoadingButton } from '../../../../components/Buttons';
import styles from './index.module.scss';

function LoadMore<P extends PC, D extends DC>({grid}: {grid: GridStore<P, D>}) {

    const {isLoading, loadPreviews} = grid;

    return <div className={styles.more}>
        <LoadingButton loading={isLoading} onClick={loadPreviews}>
            Load more
        </LoadingButton>
    </div>
}

export default observer(LoadMore)