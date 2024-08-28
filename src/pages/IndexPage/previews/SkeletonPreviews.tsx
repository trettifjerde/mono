import Preview from './Preview';
import styles from './skeleton.module.scss';

export default function SkeletonPreviews() {
    return (<>
        <SkeletonPreview />
        <SkeletonPreview />
        <SkeletonPreview />
        <SkeletonPreview />
    </>)
}

function SkeletonPreview() {
    return <Preview className={styles.item} />
}