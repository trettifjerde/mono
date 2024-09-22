import { Pathnames } from "../utils/consts"; 
import { makeAbsolutePath } from "../utils/helpers";
import { EntityPreviewComponent } from "../utils/uiTypes";
import Author from "../utils/classes/Author";
import PreviewItemWrapper from "./PreviewGrid/PreviewItemWrapper";

const AuthorPreview : EntityPreviewComponent<Author> = ({item}) => {

    const preview = item.preview;
    
    return <PreviewItemWrapper 
        url={makeAbsolutePath(Pathnames.authors, item.id)}
    >
        <h3>{preview.name}</h3>
        <p>Books published: {preview.bookN}</p>

    </PreviewItemWrapper>
}

export default AuthorPreview;