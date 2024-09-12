// import { FirebaseKeys } from "../utils/realtimeDbTypes";
// import { DetailsConstraint, PreviewConstraint } from "../utils/classes/Entity";
// import { BookPreviewInfo } from "../utils/classes/Book";
// import { FETCH_BATCH_SIZE } from "../utils/consts";

// export default abstract class DataService<P extends PreviewConstraint, D extends DetailsConstraint> {

//     static url = "https://mono-task34-default-rtdb.europe-west1.firebasedatabase.app/";
//     static makeUrl({ keys, params }: DBURLConfig) {
//         let url = DataService.url;
//         url += DataService.appendKeys(keys);
//         url += DataService.makeSearchParams(params);
//         return url;
//     }
//     static appendKeys(keys?: string[]) {
//         return !keys ? '.json' : (keys.join('/') + '.json');
//     }
//     static makeSearchParams(params?: DBURLParams) {
//         if (!params)
//             return '';

//         const stringParams : Record<string, string> = {};

//         for (const [key, value] of Object.entries(params)) {
//             stringParams[key] = typeof value === 'number' ? `${value}` : `"${value}"`
//         }

//         return '?' + new URLSearchParams(stringParams).toString();
//     }

//     batchSize = FETCH_BATCH_SIZE;

//     abstract previewsKey: FirebaseKeys;
//     abstract descriptionKey: FirebaseKeys;

//     abstract getDetails(id: string) : Promise<D | null>;

//     protected async fetchDB<T>({ init, keys, params }: DBFetchInit) {

//         return fetch(
//             DataService.makeUrl({ keys, params }),
//             init
//         )
//         .then(res => res
//             .json()
//             .then(data => {
//                 if (res.ok)
//                     return data as T | null;

//                 throw new Error(`Fetch completed successfully, but return an error code ${res.status} with data ${data}`);
//             }))
//     }

//     getPreviews(params: DBURLParams) {
//         return this.fetchDB<{ [id: string]: P }>({
//             keys: [this.previewsKey],
//             params
//         })
//         .then(prevs => {

//             if (!prevs)
//                 return [];

//             const fetchedItems = Object
//                 .entries(prevs)
//                 .map(([id, previewInfo]) => ({
//                     id,
//                     previewInfo,
//                 }))

//             return fetchedItems;
//         })
//     }

//     getPreview(id: string) {
//         return this.fetchDB<P>({
//             keys: [this.previewsKey, id]
//         })
//     }

//     getDescription(id: string) {
//         return this.fetchDB<string>({
//             keys: [this.descriptionKey, id]
//         })
//     }

//     getFullInfo(id: string) {
//         return Promise.all([
//             this.getPreview(id),
//             this.getDetails(id)
//         ])
//         .then(([previewInfo, detailsInfo]) => {
//             if (!previewInfo || !detailsInfo)
//                 return null;

//             return {
//                 id,
//                 previewInfo,
//                 detailsInfo,
//             };
//         })
//     }

//     getBookPreviews(params?: DBURLParams) {
//         return this.fetchDB<{ [id: string]: BookPreviewInfo }>({
//             keys: [FirebaseKeys.books],
//             params
//         })
//     }
// }

// export type DataServiceConstructor<P extends PreviewConstraint, D extends DetailsConstraint> = new () => DataService<P, D>;
// export type DBURLParams = Record<string, string|number>;

// type DBURLConfig = {
//     keys?: string[],
//     params?: DBURLParams
// }

// type DBFetchInit = DBURLConfig & { init?: RequestInit };