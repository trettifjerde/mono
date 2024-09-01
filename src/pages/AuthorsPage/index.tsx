import { useLoaderData } from "react-router-dom";
import { AuthorPreviewType } from "../../services/AuthorService";
import { Pathnames } from "../../utils/consts";
import { makeAbsolutePath } from "../../utils/helpers";
import { AuthorPreviewsLoaderData } from "../../utils/loaders";
import SuspendedPreviewGrid from "../../components/SuspendedPreviewGrid";
import PreviewGrid from "../../components/PreviewGrid";
import PreviewItem from "../../components/PreviewGrid/PreviewItem";

export default function AuthorsPage() {
    const {data} = useLoaderData() as AuthorPreviewsLoaderData;

    return <SuspendedPreviewGrid 
        promise={data}
        Grid={AuthorPreviewGrid} 
    /> 
}

function AuthorPreviewGrid({data: previews}: {data: AuthorPreviewType[]}) {
    return <PreviewGrid empty={!previews.length}>
        {previews.map(preview => <AuthorPreview key={preview.id} item={preview} />)}
        {!previews.length && "No books"}
    </PreviewGrid>
}

function AuthorPreview({item}: {item: AuthorPreviewType}) {
    return <PreviewItem key={item.id} url={makeAbsolutePath(Pathnames.authors, item.id)}>
        <h3>{item.name}</h3>
        <p>Books published: {item.bookN}</p>
    </PreviewItem>
}