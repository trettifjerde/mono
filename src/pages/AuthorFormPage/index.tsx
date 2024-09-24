import FormPage from "../../layouts/FormPage";
import AuthorFormComponent from "./AuthorFormComponent";

export default function AuthorFormPage() {

    return <FormPage
        storeKey="authors" 
        ItemFormPage={AuthorFormComponent}
    />
}