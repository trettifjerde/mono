import z from "zod";
import { Field } from "mobx-react-form";
import { FieldConstructor } from "mobx-react-form/lib/models/FieldInterface";
import { FirestoreKeys as FK } from "../../../utils/firestoreDbTypes";
import Book from "../../../utils/classes/Book";
import CustomForm, { FieldsConfig } from "./CustomForm";
import ImageField from "../fields/ImageField";
import AuthorField from "../fields/AuthorField";
import FormView from "../FormView";

export default class BookForm extends CustomForm<Book> {

    constructor(view: FormView<Book, BookForm>) {
        super({view, config: BookFieldsConfig, schema: $bookSchema});
    }
    
    override reset(deep?: boolean, execHook?: boolean): void {
        super.reset(deep, execHook);
        this.$(BookFormFields.author).updateSettings();
    }

    override makeField(data: FieldConstructor) {
        
        switch (data.key) {
            case BookFormFields.img:
                return new ImageField(data);

            case BookFormFields.author:
                return new AuthorField(data);

            default:
                return new Field(data);
        }
    } 
}

export enum BookFormFields {
    title = FK.name,
    img = FK.img,
    inStock = FK.inStock,
    price = FK.price,
    author = "author",
    description = "description"
}

const BookFieldsConfig : FieldsConfig<BookFormFields, Book> = {
    [BookFormFields.title]: {
        label: 'Title',
        placeholder: 'Enter book title',
        default: '',
        readValue: (b) => b.name
    },
    [BookFormFields.author]: {
        label: 'Author name',
        placeholder: "Enter book's author",
        default: null,
        readValue: (b) => b.authorInfo || null
    },
    [BookFormFields.img]: {
        label: 'Cover image',
        placeholder: 'Add a link the book cover',
        default: '',
        readValue: (b) => b.img
    },
    [BookFormFields.price]: {
        label: 'Price',
        placeholder: 'Enter book price',
        type: 'number',
        input: (v: number) => v.toString(),
        output: (v: string) => parseFloat(v),
        default: 0,
        readValue: (b) => b.previewInfo[FK.price]
    },
    [BookFormFields.inStock]: {
        label: 'Number in stock',
        placeholder: 'Enter how many books currently are in stock',
        type: 'number',
        input: (v: number) => v.toString(),
        output: (v: string) => parseFloat(v),
        default: 0,
        readValue: (b) => b.previewInfo[FK.inStock]
    }, 
    [BookFormFields.description]: {
        label: 'Description',
        placeholder: 'Enter information about the book',
        default: '',
        readValue: (b) => b.description
    }
}

const $bookSchema = z.object({
    [BookFormFields.title]: z.string().min(3, {
        message: 'Book title must be at least 3 characters long'
    }),
    [BookFormFields.img]: z.string().optional(),
    [BookFormFields.inStock]: z.number().min(0, {
        message: 'Number in stock can not be negative'
    }),
    [BookFormFields.price]: z.number().min(0.1, {
        message: 'A book must cost at least $0.10'
    }),
    [BookFormFields.author]: z.object({
        name: z.string(),
        id: z.string()
    }).or(z.null()),
    [BookFormFields.description]: z.string().optional()
});

export type BookFormShape = z.infer<typeof $bookSchema>;