import FormPage from "../../layouts/FormPage";
import BookFormComponent from "./BookFormComponent";

export default function BookFormPage() {

    return <FormPage
        storeKey="books" 
        ItemFormPage={BookFormComponent}
    />
}