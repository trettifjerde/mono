import { BookPreviewType } from "../../services/DataService";
import { Pathnames } from "../../utils/consts";
import { makeAbsolutePath } from "../../utils/helpers";
import PreviewGrid from "../PreviewGrid";
import PreviewItem from "../PreviewGrid/PreviewItem";

export default function BookPreviewGrid({data: previews}: {data: BookPreviewType[]}) {
    return <PreviewGrid empty={!previews.length}>
        {previews.map(preview => <BookPreview key={preview.id} item={preview} />)}
        {!previews.length && "No books"}
    </PreviewGrid>
}

function BookPreview({item}: {item: BookPreviewType}) {
    return <PreviewItem key={item.id} url={makeAbsolutePath(Pathnames.books, item.id)}>
        <h3>{item.title}</h3>
        <h5>by {item.authorName}</h5>
        <p>Price: ${item.price}</p>
        <p>Number in stock: {item.numberInStock}</p>
    </PreviewItem>
}