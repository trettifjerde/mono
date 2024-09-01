import { Suspense } from "react";
import { Await } from "react-router-dom"

export default function SuspendedView<T>({promise, Component, Fallback, ErrorBoundary}: {
    promise: Promise<T>,
    Component: ({data}: {data: T}) => JSX.Element,
    Fallback: () => JSX.Element,
    ErrorBoundary: () => JSX.Element
}) {

    return <Suspense fallback={<Fallback />}>
        <Await
            resolve={promise}
            errorElement={<ErrorBoundary />}
        >
            {(data: Awaited<typeof promise>) => <Component data={data} />}
        </Await>
    </Suspense>
}
