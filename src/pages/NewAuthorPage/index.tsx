import { useContext } from "react";
import { RootStoreContext } from "../../stores/StoreContext";
import AuthorFormPage from "../../layouts/FormPages/author/AuthorFormPage";

export default function NewAuthorPage() {

    const {formView} = useContext(RootStoreContext).authors;
    
    return <AuthorFormPage view={formView} />
}