import { observer } from "mobx-react-lite";
import ImageField from "../../stores/FormView/fields/ImageField";
import InputComponent from "./InputFieldComponent";
import styles from './form.module.scss';

function ImageComponent({field}: {field: ImageField}) {

    const {imgSrc, onClearBtnClick, onImageLoadError} = field;

    return <InputComponent 
            field={field}
            isRequired={false}
            onBtnClick={onClearBtnClick}
        >

        {field.imgSrc && <div className={styles.img}>

            <img 
                src={imgSrc} 
                onLoad={() => field.validate()}
                onError={onImageLoadError}
            />

        </div>}
    </InputComponent>
}

export default observer(ImageComponent);