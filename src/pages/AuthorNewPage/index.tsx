import { useContext } from "react";
import { RootStoreContext } from "../../stores/StoreContext";
import AuthorFormPage from "../../layouts/FormPage/AuthorFormPage";

function AuthorNewPage() {

    const {formView} = useContext(RootStoreContext).authors;

    formView.prepareItem(null);

    return <AuthorFormPage view={formView} />
}

export default AuthorNewPage;