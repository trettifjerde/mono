import { FirebaseKeys } from "../utils/dbTypes";
import { DetailsConstraint, PreviewConstraint } from "../utils/classes/Entity";
import { BookPreviewInfo } from "../utils/classes/Book";

export default abstract class DataService<P extends PreviewConstraint, D extends DetailsConstraint> {

    static url = "https://mono-task34-default-rtdb.europe-west1.firebasedatabase.app/";
    static makeUrl({ keys, params }: DBURLConfig) {
        let url = `${DataService.url}${keys ? keys.join('/') : ''}.json`;

        if (params)
            url += `?${new URLSearchParams(params).toString()}`;

        return url;
    }

    abstract previewsKey: FirebaseKeys;
    abstract descriptionKey: FirebaseKeys;
    abstract getDetails(id: string) : Promise<D | null>;

    protected async fetchDB<T>({ init, keys, params }: DBFetchInit) {

        return fetch(
            DataService.makeUrl({ keys, params }),
            init
        )
        .then(res => res
            .json()
            .then(data => {
                if (res.ok)
                    return data as T | null;

                throw new Error(`Fetch completed successfully, but return an error code ${res.status} with data ${data}`);
            }))
    }

    getPreviews(params?: DBURLParams) {
        return this.fetchDB<{ [id: string]: P }>({
            keys: [this.previewsKey],
            params
        })
        .then(prevs => {

            if (!prevs)
                return [];

            const fetchedItems = Object
                .entries(prevs)
                .map(([id, previewInfo]) => ({
                    id,
                    previewInfo,
                }))
                .sort((a, b) => a.id < b.id ? -1 : 1);

            return fetchedItems;
        })
    }

    getPreview(id: string) {
        return this.fetchDB<P>({
            keys: [this.previewsKey, id]
        })
    }

    getDescription(id: string) {
        return this.fetchDB<string>({
            keys: [this.descriptionKey, id]
        })
    }

    getFullInfo(id: string) {
        return Promise.all([
            this.getPreview(id),
            this.getDetails(id)
        ])
        .then(([previewInfo, detailsInfo]) => {
            if (!previewInfo || !detailsInfo)
                return null;

            return {
                id,
                previewInfo,
                detailsInfo,
            };
        })
    }

    getBookPreviews(params?: DBURLParams) {
        return this.fetchDB<{ [id: string]: BookPreviewInfo }>({
            keys: [FirebaseKeys.books],
            params
        })
    }
}

export type DataServiceConstructor<P extends PreviewConstraint, D extends DetailsConstraint> = new () => DataService<P, D>;

type DBURLParams = Record<string, string>;
type DBURLConfig = {
    keys?: string[],
    params?: DBURLParams
}
type DBFetchInit = DBURLConfig & { init?: RequestInit };