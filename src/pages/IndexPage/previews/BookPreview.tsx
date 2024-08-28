import { PATHNAMES } from "../../../utils/consts"
import { BookPreviewType } from "../../../utils/types"
import Preview from "./Preview"

export default function BookPreview({item}: {item: BookPreviewType}) {
    return <Preview url={`${PATHNAMES.books}/${item.id}`}>
        <h3>{item.name}</h3>
        <p>Price: ${item.price}</p>
        <p>Number in stock: {item.numberInStock}</p>
    </Preview>
}