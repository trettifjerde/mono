import SuspendedView from "../SuspendedView";
import ItemNotFound from "./ItemNotFound";

export default function SuspendedEntry<T>({promise, Component, Fallback}: {
    promise: Promise<T>,
    Component: ({data}: {data: T}) => JSX.Element,
    Fallback: () => JSX.Element
}) {
    
    return <SuspendedView 
        promise={promise}
        Component={Component}
        Fallback={Fallback}
        ErrorBoundary={ItemNotFound}
    />
}