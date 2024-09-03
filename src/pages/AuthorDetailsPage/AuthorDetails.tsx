import { Author } from "../../services/AuthorService";
import { authorService } from "../../services/instances";
import AuthorWrapper from "./AuthorWrapper";
import SuspendedPreviewGrid from "../../components/SuspendedPreviewGrid";
import BookPreviewGrid from "../../components/BookPreviewGrid";

export default function AuthorDetails({data: author}: {data: Author}) {

    const bookProm = authorService.getAuthorBooks(author.id, author.bookN);

    console.log('Author details');

    return <AuthorWrapper author={author}
    >
        <SuspendedPreviewGrid 
            promise={bookProm}
            Grid={BookPreviewGrid}
        />
    </AuthorWrapper>
}