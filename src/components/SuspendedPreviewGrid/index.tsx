import SuspendedView from "../SuspendedView";
import PreviewGridSkeleton from "./PreviewGridSkeleton";
import PreviewGridReloader from "./PreviewGridReloader";

export default function SuspendedPreviewGrid<T>({promise, Grid}: {
    promise: Promise<T>,
    Grid: ({data}: {data: T}) => JSX.Element
}) {

    return <SuspendedView 
        promise={promise}
        ErrorBoundary={PreviewGridReloader}
        Component={Grid}
        Fallback={PreviewGridSkeleton}
    />
}