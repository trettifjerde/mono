// export enum FirebaseKeys {
//     books = "books",
//     authors = "authors",
//     bios = "bios",
//     descriptions = "descriptions"
// }

// export type FirebaseDB = {
//     [FirebaseKeys.books]: {
//         [bookId: string]: {
//             name: string,
//             authorId: string,
//             authorName: string,
//             inStock: number,
//             price: number,
//             img?: string,
//         }
//     },
//     [FirebaseKeys.descriptions]: {
//         [bookId: string]: string
//     },
//     [FirebaseKeys.authors]: {
//         [authorId: string]: {
//             name: string,
//             bookN: number,
//             img?: string,
//         }
//     },
//     [FirebaseKeys.bios]: {
//         [authorId: string]: string
//     },
// };

// export enum BookSortTypes {
//     title = "title",
//     priceHigh = "high",
//     priceLow = "low"
// };

// export const BookSortOptions = {
//     [BookSortTypes.title]: {
//         dbKey: "name",
//         text: "Book title"
//     },
//     [BookSortTypes.priceHigh]: {
//         dbKey: "price",
//         text: "Price (high)"
//     },
//     [BookSortTypes.priceLow]: {
//         dbKey: "price",
//         text: "Price (low)"
//     }
// }

// export enum AuthorSortTypes {
//     name = "name",
//     books = "books"
// };

// export const AuthorSortOptions = {
//     [AuthorSortTypes.name]: {
//         dbKey: "name",
//         text: "Author name"
//     },
//     [AuthorSortTypes.books]: {
//         dbKey: "bookN",
//         text: "Number of books"
//     },
// }