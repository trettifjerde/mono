import PreviewGridWrapper from './PreviewGridWrapper';
import PreviewItem from './PreviewItem';

export default function PreviewGridSkeleton() {
    return (<PreviewGridWrapper type='skeleton'>
        <PreviewItem />
        <PreviewItem />
        <PreviewItem />
        <PreviewItem />
    </PreviewGridWrapper>)
}