import { useLoaderData } from "react-router-dom";
import { BookLoaderData } from "../../utils/loaders";
import SuspendedEntry from "../../components/SuspendedEntry";
import BookDetails from "./BookDetails";
import BookWrapper from "./BookWrapper";
import { LinkButton } from "../../components/Buttons";

export default function BookDetailsPage() {
    const {data} = useLoaderData() as BookLoaderData;
    
    return <SuspendedEntry 
        promise={data}
        Component={BookDetails} 
        Fallback={BookSkeleton}
        ErrorBoundary={BookNotFound}
    />
}

function BookSkeleton() {
    return <BookWrapper skeleton />
}

function BookNotFound() {
    return <BookWrapper>
        <LinkButton className="link-btn" to="../../">Go browse other books</LinkButton>
    </BookWrapper>
}