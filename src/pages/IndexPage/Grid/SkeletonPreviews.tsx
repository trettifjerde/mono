import PreviewWrapper from './PreviewWrapper';
import styles from './SkeletonPreviews.module.scss';

export default function SkeletonPreviews() {
    return (<>
        <SkeletonPreview />
        <SkeletonPreview />
        <SkeletonPreview />
        <SkeletonPreview />
    </>)
}

function SkeletonPreview() {
    return <PreviewWrapper className={styles.item} />
}