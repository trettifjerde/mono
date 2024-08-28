import { PATHNAMES } from "../../../utils/consts";
import { AuthorPreviewType } from "../../../utils/types"
import Preview from "./Preview";

export default function AuthorPreview({item} : {item: AuthorPreviewType}) {
    return <Preview url={`${PATHNAMES.authors}/${item.id}`}>
        <h3>{item.name}</h3>
        <p>Number of books: {item.numberOfBooks}</p>
    </Preview>
}