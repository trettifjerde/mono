import { useLoaderData } from "react-router-dom";
import { BookLoaderData } from "../../utils/loaders";
import SuspendedEntry from "../../components/SuspendedEntry";
import BookWrapper from "./BookWrapper";
import { BookDetails } from "./BookDetails/BookDetails";

export default function BookDetailsPage() {
    const {data} = useLoaderData() as BookLoaderData;
    
    return <SuspendedEntry 
        promise={data}
        Component={BookDetails} 
        Fallback={BookSkeleton}
    />
}

function BookSkeleton() {
    return <BookWrapper />
}