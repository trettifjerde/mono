// import DataService from "./DataService";
// import { BookDetailsInfo, BookPreviewInfo } from "../../utils/classes/Book";
// import { FirebaseKeys } from "../../utils/realtimeDbTypes";

// export default class BookService extends DataService<BookPreviewInfo, BookDetailsInfo> {

//     previewsKey = FirebaseKeys.books;
//     descriptionKey = FirebaseKeys.descriptions;

//     override getDetails(id: string) {
//         return this.getDescription(id)
//             .then(description => description ? {description} : null)
//     }
// }