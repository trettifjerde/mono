import { FirebaseBookPreview, FirebaseKeys } from "../utils/dbTypes";

export default abstract class DataService {

    static url = "https://mono-task34-default-rtdb.europe-west1.firebasedatabase.app/";
    
    static makeUrl(keys: DBURLConfig['keys'], params: DBURLConfig['params']) {
        let url = `${DataService.url}${keys ? keys.join('/') : ''}.json`;

        if (params) 
            url += `?${new URLSearchParams(params).toString()}`;
            
        return url;
    }

    constructor() { }

    protected async fetchDB<T>({init, keys, params}: DBFetchInit) {

        return fetch(
            DataService.makeUrl(keys, params),
            init
        )
        .then(res => res
            .json()
            .then(data => {
                if (res.ok)
                    return data as T|null;

                throw new Error(`Fetch completed successfully, but return an error code ${res.status} with data ${data}`);
            }))
    }

    protected getPreviews<T>(init: DBFetchInit) {

        return this.fetchDB<{[id: string]: T}>(init)
            .then(data => {
                if (!data)
                    return [];
                return Object
                    .entries(data)
                    .map(([id, info]) => ({id, ...info}))
            })
    }

    getBookPreviews(params?: DBFetchInit['params']) {
        return this.getPreviews<FirebaseBookPreview>({
            keys: [FirebaseKeys.books],
            params
        })
    }

}

export type BookPreviewType = Awaited<ReturnType<DataService['getBookPreviews']>>[0];


type DBURLConfig = {
    keys?: string[], 
    params?: Record<string, string>

}
type DBFetchInit = DBURLConfig & {init?: RequestInit};