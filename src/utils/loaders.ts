import { defer } from "react-router-dom";
import { Pathnames } from "./consts";
import BookService from "../services/BookService";
import AuthorService from "../services/AuthorService";
import { authorService, bookService } from "../services/instances";

export async function indexPageLoader() {
    return defer({
        data: bookService.getBookPreviews()
    })
}

export async function authorsPageLoader() {
    return defer({
        data: authorService.getAuthorPreviews()
    })
}

export async function bookLoader({ params }: { params: any }) {
    return defer({
        data: bookService.getBook(params[Pathnames.bookId])
    });
}

export async function authorLoader({params}: {params: any}) {
    return defer({
        data: authorService.getAuthor(params[Pathnames.authorId])
    })
}

export type BookPreviewsLoaderData = {data: ReturnType<BookService['getBookPreviews']>};
export type AuthorPreviewsLoaderData = {data: ReturnType<AuthorService['getAuthorPreviews']>};
export type BookLoaderData = {data: ReturnType<BookService['getBook']>};
export type AuthorLoaderData = {data: ReturnType<AuthorService['getAuthor']>}