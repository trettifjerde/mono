import { FirebaseAuthorPreview, FirebaseAuthorBio, FirebaseKeys } from "../utils/dbTypes";
import DataService from "./DataService";

export default class AuthorService extends DataService {

    constructor() {
        super()
    }

    getAuthorPreviews() {
        return this.getPreviews<FirebaseAuthorPreview>({
            keys: [FirebaseKeys.authors]
        })
    }

    getAuthor(id: string) {
        return Promise.all([
            this.fetchDB<FirebaseAuthorPreview>({
                keys: [FirebaseKeys.authors, id]
            }),
            this.fetchDB<FirebaseAuthorBio>({
                keys: [FirebaseKeys.authorBios, id]
            })
        ])
        .then(([author, bio]) => {
            if (!author)
                throw new Error('Author not found')

            return {
                id,
                ...author,
                bio
            }
        })
        .then(author => this
            .getAuthorBooks(author.id, author.bookN)
            .then(books => {
                const {bookN, ...authorInfo} = author;
                return {
                    ...authorInfo,
                    books
                }
            })
            .catch(() => {
                throw new Error('Author not found')
            })
        )
    }
    getAuthorBooks(authorId: string, bookN: number) {
        return this.getBookPreviews({
            orderBy: `"authorId"`,
            startAt: `"${authorId}"`,
            limitToFirst: bookN.toString()
        })
    }
}

export type AuthorPreviewType = Awaited<ReturnType<AuthorService['getAuthorPreviews']>>[0];
export type Author = Awaited<ReturnType<AuthorService['getAuthor']>>