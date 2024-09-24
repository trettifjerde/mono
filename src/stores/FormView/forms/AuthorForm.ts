import z from "zod";
import { Field } from "mobx-react-form";
import { FieldConstructor } from "mobx-react-form/lib/models/FieldInterface";
import { FirestoreKeys } from "../../../utils/firestoreDbTypes";
import Author from "../../../utils/classes/Author";
import CustomForm, { FieldsConfig } from "./CustomForm";
import FormView from "../FormView";
import ImageField from "../fields/ImageField";
import BooksField from "../fields/BooksField";

export default class AuthorForm extends CustomForm<Author> {

    constructor(view: FormView<Author, AuthorForm>) {
        super({view, config: AuthorFieldsConfig, schema: $authorSchema});
    }

    override makeField(data: FieldConstructor) {
        
        switch (data.key) {
            case AuthorFormFields.img:
                return new ImageField(data);

            case AuthorFormFields.bookIds:
                return new BooksField(data);

            default:
                return new Field(data);
        }
    } 
}

export enum AuthorFormFields {
    name = FirestoreKeys.name,
    img = FirestoreKeys.img,
    bio = "bio",
    bookIds = "bookIds"
}

const AuthorFieldsConfig : FieldsConfig<AuthorFormFields, Author> = {
    [AuthorFormFields.name]: {
        label: 'Author name',
        placeholder: 'Enter author name',
        default: '',
        readValue: (a) => a.name
    },
    [AuthorFormFields.img]: {
        label: 'Photo',
        placeholder: 'Add a link to their photo',
        default: '',
        readValue: (a) => a.img
    },
    [AuthorFormFields.bio]: {
        label: 'Biography',
        placeholder: 'Enter some information about the author',
        default: '',
        readValue: (a) => a.description
    }, 
    [AuthorFormFields.bookIds]: {
        label: 'Books',
        default: [] as string[],
        readValue: (a) => a.books.map(b => b.id)
    }
}


const $authorSchema = z.object({
    [AuthorFormFields.name]: z.string().min(3, {
        message: 'Author name must be at least 3 characters'
    }),
    [AuthorFormFields.img]: z.string().optional(),
    [AuthorFormFields.bio]: z.string().optional(),
    [AuthorFormFields.bookIds]: z.array(z.string())
});

export type AuthorFormShape = z.infer<typeof $authorSchema>;