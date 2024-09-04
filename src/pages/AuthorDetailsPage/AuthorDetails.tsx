import { Author } from "../../services/AuthorService";
import AuthorWrapper from "./AuthorWrapper";
import BookPreviewGrid from "../../components/BookPreviewGrid";

export default function AuthorDetails({data: author}: {data: Author}) {

    return <AuthorWrapper author={author}
    >
        <BookPreviewGrid data={author.books} />

    </AuthorWrapper>
}