import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Pathnames } from "../../utils/consts";
import { RootStoreContext } from "../../stores/StoreContext";
import AuthorFormPage from "../../layouts/FormPage/AuthorFormPage";

function AuthorEditPage() {
    const {formView} = useContext(RootStoreContext).authors;
    const params = useParams() as {[Pathnames.authorId]: string};

    formView.prepareItem(params[Pathnames.authorId]);
    
    return <AuthorFormPage view={formView} />
}

export default AuthorEditPage;