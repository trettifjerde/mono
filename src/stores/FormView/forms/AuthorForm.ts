import z from "zod";
import {Field, Form} from "mobx-react-form";
import zod from 'mobx-react-form/lib/validators/ZOD';
import { FieldConstructor } from "mobx-react-form/lib/models/FieldInterface";
import { $authorSchema, AuthorFieldNames, AuthorFields } from "../configs/authorConfig";
import ImageField from "../fields/ImageField";
import AuthorFormView from "../AuthorFormView";

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
            fields: AuthorFields
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