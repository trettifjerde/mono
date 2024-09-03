import { useAsyncError, useRevalidator } from "react-router-dom";
import PreviewGrid from "../PreviewGrid";
import SkeletonPreviews from "./PreviewGridSkeleton";

export default function Reloader() {

    const {revalidate, state} = useRevalidator();
    const error = useAsyncError() as Error;

    switch (state) {
        case 'loading':
            return <SkeletonPreviews />

        default:
            return <PreviewGrid empty>
                <div>{error.message}</div>
                <button onClick={() => revalidate()}>Try again</button>
            </PreviewGrid>
    }
    
}