import { AuthorPreviewType, BookPreviewType } from "../utils/types";

export async function fetchBooks() {
    return new Promise<typeof BOOKS>(resolve => {
        console.log('Fetching books');
        setTimeout(() => resolve(BOOKS), 2000);
    })
}

export async function fetchAuthors() {
    return new Promise<typeof AUTHORS>(resolve => {
        console.log('Fetching authors');
        setTimeout(() => resolve(AUTHORS), 2000);
    })
}

const BOOKS : BookPreviewType[] = [
    {
        name: 'How to meow',
        numberInStock: 3,
        price: 2.99,
        imgSrc: '',
        id: '1',
        authorId: '1'
    },
    {
        name: 'How to woof',
        numberInStock: 0,
        price: 3.99,
        imgSrc: '',
        id: '2',
        authorId: '1'
    }
];
const AUTHORS : AuthorPreviewType[] = [
    {
        name: 'Sir Pouncelot',
        id: '1',
        numberOfBooks: 2,
        imgSrc: ''
    }
];