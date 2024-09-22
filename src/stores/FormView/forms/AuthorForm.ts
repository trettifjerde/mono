import z from "zod";
import zod from 'mobx-react-form/lib/validators/ZOD';
import {Field, Form} from "mobx-react-form";
import { FieldConstructor } from "mobx-react-form/lib/models/FieldInterface";
import { FirestoreKeys } from "../../../utils/firestoreDbTypes";
import AuthorFormView from "../AuthorFormView";
import ImageField from "../fields/ImageField";
import BooksField from "../fields/BooksField";

export default class AuthorForm extends Form {

    view : AuthorFormView;

    constructor(view: AuthorFormView) {
        super();
        this.view = view;
    }

    override makeField(data: FieldConstructor) {
        
        switch (data.key) {
            case AuthorFieldNames.img:
                return new ImageField(data);

            case AuthorFieldNames.bookIds:
                return new BooksField(data);

            default:
                return new Field(data);
        }
    } 

    plugins() {
        return {
            zod: zod({
                package: z,
                schema: $authorSchema
            })
        }
    }

    setup() {
        return {
            fields: [
                {
                    name: AuthorFieldNames.name,
                    label: 'Author name',
                    placeholder: 'Enter author name',
                    value: '',
                    default: ''
                }, 
                {
                    name: AuthorFieldNames.img,
                    label: 'Photo',
                    placeholder: 'Add a link to their photo',
                    value: '',
                    default: ''
                }, 
                {
                    name: AuthorFieldNames.bio,
                    label: 'Biography',
                    placeholder: 'Enter some information about the author',
                    value: '',
                    default: ''
                }, 
                {
                    name: AuthorFieldNames.bookIds,
                    label: 'Books',
                    value: [] as string[],
                    default: [] as string[]
                }
            ]
        }
    }

    hooks() {
        return {
            onSuccess(form: AuthorForm) {
                form.view.submit(form.values());
            },
            onError(form: AuthorForm) {
                console.log('errors', form.errors());
            }
        }
    }
}

export enum AuthorFieldNames {
    name = FirestoreKeys.name,
    img = FirestoreKeys.img,
    bio = "bio",
    bookIds = "bookIds"
}

const $authorSchema = z.object({
    [AuthorFieldNames.name]: z.string().min(3, {
        message: 'Author name must be at least 3 characters'
    }),
    [AuthorFieldNames.img]: z.string().optional(),
    [AuthorFieldNames.bio]: z.string().optional(),
    [AuthorFieldNames.bookIds]: z.array(z.string())
});

export type AuthorFormShape = z.infer<typeof $authorSchema>;