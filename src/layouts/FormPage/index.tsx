import { useContext, useEffect } from "react";
import { RootStoreContext } from "../../stores/StoreContext";
import { useParams } from "react-router-dom";
import { Pathnames } from "../../utils/consts";
import FormView from "../../stores/FormView/FormView";

function FormPage({storeKey, ItemFormPage }: {
    storeKey: "authors" | "books",
    ItemFormPage: ({view}: {view: FormView}) => JSX.Element;
}) {

    const {formView} = useContext(RootStoreContext)[storeKey];
    const params = useParams() as {[Pathnames.id]: string};

    formView.prepareItem(params[Pathnames.id]);

    useEffect(() => {
        return () => formView.reset();
    }, [])
    
    return <ItemFormPage view={formView} />
}

export default FormPage;