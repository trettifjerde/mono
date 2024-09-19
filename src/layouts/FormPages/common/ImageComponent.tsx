import { observer } from "mobx-react-lite";
import ImageField from "../../../stores/FormView/fields/ImageField";
import InputComponent from "./InputComponent";

function ImageComponent({field}: {field: ImageField}) {

    return <>
        <InputComponent 
            field={field}
            isRequired={false}
        />
    </>
}

export default observer(ImageComponent);