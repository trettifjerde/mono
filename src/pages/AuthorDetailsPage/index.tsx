import { useLoaderData } from "react-router-dom";
import { authorService } from "../../services/instances";
import { Author } from "../../services/AuthorService";
import { AuthorLoaderData } from "../../utils/loaders";
import SuspendedEntry from "../../components/SuspendedEntry";
import BookPreviewGrid from "../../components/BookPreviewGrid";
import SuspendedPreviewGrid from "../../components/SuspendedPreviewGrid";
import styles from './index.module.scss';

export default function AuthorDetailsPage() {

    const {data} = useLoaderData() as AuthorLoaderData;

    return <SuspendedEntry 
        promise={data}
        Component={AuthorDetails} 
        Fallback={() => <></>}
    />
}

function AuthorDetails({data: author}: {data: Author}) {

    const bookProm = authorService.getAuthorBooks(author.id, author.bookN);

    return <div className={styles.author}>
        <h1>{author.name}</h1>
        <div>
            <SuspendedPreviewGrid 
                promise={bookProm}
                Grid={BookPreviewGrid}
            />
        </div>
        <div>{author.bio || ''}</div>
    </div>
}