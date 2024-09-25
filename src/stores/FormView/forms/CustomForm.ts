import z from "zod";
import { action, makeObservable, observable } from "mobx";
import { Form} from "mobx-react-form";
import zod from 'mobx-react-form/lib/validators/ZOD';
import Entity from "../../../utils/classes/Entity";
import FormView from "../FormView";

export default class CustomForm<E extends Entity> extends Form {

    view : FormView<E, CustomForm<E>>;
    config: FieldsConfig<any, E>;
    validationError: string | null = null;

    constructor({view, config, schema} : {
        view: FormView<E, CustomForm<E>>, 
        config: FieldsConfig<any, E>, 
        schema: z.ZodObject<any>
    }) {

        const fields = Object.entries(config)
            .map(([name, {readValue, ...info}]) => ({
                name,
                ...info,
                value: info.default
            }));

        const plugins = {
            zod: zod({ package: z, schema: schema })
        };

        super({ fields }, { plugins });

        this.view = view;
        this.config = config;

        makeObservable(this, {
            validationError: observable,
            updateDefaults: action,
            setValidationError: action.bound
        })
    }

    updateDefaults(item: E | null) {
        this.setValidationError(null);
        
        if (item) 
            for (const field in this.config) 
                this.$(field).set('default', this.config[field].readValue(item));
            
        else 
            for (const field in this.config) 
                this.$(field).set('default', this.config[field].default);

        this.reset();
    }

    setValidationError(message: string|null) {
        this.validationError = message;
    }

    hooks() {
        return {
            onSuccess(form: CustomForm<E>) {
                form.view.submit(form.values());
            },
            onError(form: CustomForm<E>) {
                form.setValidationError('Form contains errors');
            }
        }
    }
}

export type FieldsConfig<Keys extends string, E extends Entity> = Record<Keys, {
    label: string,
    placeholder?: string,
    type?: 'number',
    input?: (v: any) => any,
    output?: (v: any) => any,
    readValue: (e: E) => any,
    default: any,
}>;