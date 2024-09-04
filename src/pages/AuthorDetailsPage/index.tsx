import { useLoaderData, Link } from "react-router-dom";
import { AuthorLoaderData } from "../../utils/loaders";
import { Author } from "../../services/AuthorService";
import SuspendedEntry from "../../components/SuspendedEntry";
import AuthorWrapper from "./AuthorWrapper";
import PreviewGridSkeleton from "../../components/SuspendedPreviewGrid/PreviewGridSkeleton";
import BookPreviewGrid from "../../components/BookPreviewGrid";

export default function AuthorDetailsPage() {
    const {data} = useLoaderData() as AuthorLoaderData;

    return <SuspendedEntry 
        promise={data}
        Component={AuthorDetails}
        Fallback={AuthorSkeleton}
        ErrorBoundary={AuthorNotFound}
    />
}

function AuthorDetails({data: author}: {data: Author}) {

    return <AuthorWrapper author={author}>
        <BookPreviewGrid data={author.books} />
    </AuthorWrapper>
}

function AuthorSkeleton() {
    return <AuthorWrapper skeleton>
        <PreviewGridSkeleton />
    </AuthorWrapper>
}

function AuthorNotFound() {
    return <AuthorWrapper >
        <Link to="../">Go browse other authors</Link>
    </AuthorWrapper>
}