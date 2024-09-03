import { useLoaderData } from "react-router-dom";
import { AuthorLoaderData } from "../../utils/loaders";
import SuspendedEntry from "../../components/SuspendedEntry";
import AuthorDetails from "./AuthorDetails";
import AuthorWrapper from "./AuthorWrapper";
import PreviewGridSkeleton from "../../components/SuspendedPreviewGrid/PreviewGridSkeleton";

export default function AuthorDetailsPage() {
    const {data} = useLoaderData() as AuthorLoaderData;

    return <SuspendedEntry 
        promise={data}
        Component={AuthorDetails}
        Fallback={AuthorSkeleton}
    />
}

function AuthorSkeleton() {
    return <AuthorWrapper>
        <PreviewGridSkeleton />
    </AuthorWrapper>
}
