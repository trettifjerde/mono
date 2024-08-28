import { defer } from "react-router-dom";
import { IndexPageTab } from "./types";
import { fetchAuthors, fetchBooks } from '../services/dummyFetcher';

export function indexPageLoader(tab: IndexPageTab) {
    let fn;

    switch (tab) {
        case IndexPageTab.authors:
            fn = fetchAuthors;
            break;

        default:
            fn = fetchBooks;
    }

    return async() => defer({
        tab,
        items: fn()
    })
}