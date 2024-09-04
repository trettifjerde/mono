import SuspendedView from "../SuspendedView";

export default function SuspendedEntry<T>({promise, ErrorBoundary, Component, Fallback}: {
    promise: Promise<T>,
    Component: ({data}: {data: T}) => JSX.Element,
    Fallback: () => JSX.Element,
    ErrorBoundary: () => JSX.Element
}) {
    
    return <SuspendedView 
        promise={promise}
        Component={Component}
        Fallback={Fallback}
        ErrorBoundary={ErrorBoundary}
    />
}