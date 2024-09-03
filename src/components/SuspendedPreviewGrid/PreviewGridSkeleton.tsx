import PreviewGrid from '../PreviewGrid';
import PreviewItem from '../PreviewGrid/PreviewItem';

export default function PreviewGridSkeleton() {
    return (<PreviewGrid skeleton>
        <PreviewItem />
        <PreviewItem />
        <PreviewItem />
        <PreviewItem />
    </PreviewGrid>)
}