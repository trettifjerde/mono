import SuspendedView from "../SuspendedView";
import Skeleton from "./Skeleton";
import Reloader from "./Reloader";

export default function SuspendedPreviewGrid<T>({promise, Grid}: {
    promise: Promise<T>,
    Grid: ({data}: {data: T}) => JSX.Element
}) {

    return <SuspendedView 
        promise={promise}
        Fallback={Skeleton}
        Component={Grid}
        ErrorBoundary={Reloader}
    />
}