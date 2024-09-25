import { action, makeObservable, observable } from "mobx";
import { Field } from "mobx-react-form";
import { FieldConstructor } from "mobx-react-form/lib/models/FieldInterface";
import { ChangeEvent } from "react";

export default class ImageField extends Field {

    timer: any = null;
    imgSrc: string | undefined = undefined;

    constructor(props: FieldConstructor) {
        super(props);

        makeObservable(this, {
            timer: observable,
            imgSrc: observable,
            loadImage: action,
            onClearBtnClick: action.bound,
            onImageLoadError: action.bound
        });
    }

    loadImage(src: string) {
        this.imgSrc = src;
    }

    onImageLoadError() {
        this.imgSrc = undefined;
        this.invalidate("Image in invalid");
    }

    onClearBtnClick() {
        this.set(this.initial);
        this.imgSrc = undefined;
        this.resetValidation();
    }

    override onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const src = e.target.value;
        this.set(src);

        clearTimeout(this.timer);

        this.timer = setTimeout(() =>
            this.loadImage(src),
            400
        );
    }

    override onBlur = () => this.loadImage(this.value);

    override reset() {
        super.reset();
        clearTimeout(this.timer);
        this.imgSrc = this.default;
        this.timer = null;
    }
}