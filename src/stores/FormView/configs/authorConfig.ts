import { z } from "zod";
import { FirestoreKeys } from "../../../utils/firestoreDbTypes";

export enum AuthorFieldNames {
    name = FirestoreKeys.name,
    img = FirestoreKeys.img,
    bio = "bio",
    books = "books"
}

export const $authorSchema = z.object({
    [AuthorFieldNames.name]: z.string().min(3, {
        message: 'Author name must be at least 3 characters'
    }),
    [AuthorFieldNames.img]: z.string().optional(),
    [AuthorFieldNames.bio]: z.string().optional(),
    [AuthorFieldNames.books]: z.array(z.string()).or(z.string())
});

export type AuthorFormShape = z.infer<typeof $authorSchema>;

const NameField = {
    name: AuthorFieldNames.name,
    label: 'Author name',
    placeholder: 'Enter author name',
};

const ImageField = {
    name: AuthorFieldNames.img,
    label: 'Photo',
    placeholder: 'Add a link to their photo',
};

const BioField = {
    name: AuthorFieldNames.bio,
    label: 'Biography',
    placeholder: 'Enter some information about the author',
};

const BooksField = {
    name: AuthorFieldNames.books,
    label: 'Books',
    fields: [] as BookField[] 
}

export const AuthorFields = [NameField, ImageField, BioField, BooksField];

export type AuthorField = typeof AuthorFields[0];
export type BookField = {
    placeholder: 'Book name',
    value: string, 
    extra: string
}