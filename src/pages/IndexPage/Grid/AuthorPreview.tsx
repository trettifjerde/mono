import { PATHNAMES } from "../../../utils/consts";
import { AuthorPreviewType } from "../../../utils/types"
import PreviewWrapper from "./PreviewWrapper";

export default function AuthorPreview({item} : {item: AuthorPreviewType}) {
    return <PreviewWrapper url={`${PATHNAMES.authors}/${item.id}`}>
        <h3>{item.name}</h3>
        <p>Number of books: {item.numberOfBooks}</p>
    </PreviewWrapper>
}