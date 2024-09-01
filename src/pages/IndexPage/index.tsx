import { useLoaderData } from "react-router-dom";
import { BookPreviewsLoaderData } from "../../utils/loaders";
import SuspendedPreviewGrid from "../../components/SuspendedPreviewGrid";
import BookPreviewGrid from "../../components/BookPreviewGrid";

export default function IndexPage() {

    const {data} = useLoaderData() as BookPreviewsLoaderData;

    return <SuspendedPreviewGrid 
        promise={data}
        Grid={BookPreviewGrid} 
    /> 
}