import { LoadingButton } from '../../../../components/Buttons';
import styles from './index.module.scss';

export default function LoadMore({isLoading, loadPreviews}: {
    isLoading: boolean,
    loadPreviews: () => void
}) {

    return <div className={styles.more}>
        <LoadingButton loading={isLoading} onClick={loadPreviews}>
            Load more
        </LoadingButton>
    </div>
}