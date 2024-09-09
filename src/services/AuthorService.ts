import { AuthorDetailsInfo, AuthorPreviewInfo } from "../utils/classes/Author";
import { FirebaseKeys } from "../utils/dbTypes";
import DataService from "./DataService";

export default class AuthorService extends DataService<AuthorPreviewInfo, AuthorDetailsInfo> {

    previewsKey = FirebaseKeys.authors;
    descriptionKey = FirebaseKeys.bios;

    getAuthorBooks(authorId: string) {
        return this.getBookPreviews({
            orderBy: `"authorId"`,
            startAt: `"${authorId}"`,
            endAt: `"${authorId}"`
        })
    }

    override getDetails(id: string) {
        return Promise.all([
            this.getDescription(id),
            this.getAuthorBooks(id)
        ])
        .then(([description, books]) => {
            if (!books)
                return null;

            return {
                description: description || '',
                books: Object.entries(books).map(([id, info]) => ({id, ...info}))
            }
        })
    }
}