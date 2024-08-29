import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom"
import { AuthorPreviewType, BookPreviewType, IndexLoaderData, IndexPageTab } from "../../../utils/types";
import AuthorPreview from "./AuthorPreview";
import BookPreview from "./BookPreview";
import SkeletonPreviews from "./SkeletonPreviews";
import styles from './index.module.scss';

export default function Grid() {
    const {tab, items} = useLoaderData() as IndexLoaderData;

    const renderAwaitedTab = () => {
        switch (tab) {
            case IndexPageTab.authors:
                return <Await resolve={items}>
                    {(resItems: AuthorPreviewType[]) => resItems.map(item => <AuthorPreview key={item.id} item={item} />)}
                </Await>
    
            default:
                return <Await resolve={items}>
                    {(resItems: BookPreviewType[]) => resItems.map(item => <BookPreview key={item.id} item={item} />)}
                </Await>
        }
    }

    return <div className={styles.grid}>
        <Suspense fallback={<SkeletonPreviews />}>
            { renderAwaitedTab() }
        </Suspense>
    </div>
}