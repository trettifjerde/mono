import { ReactNode, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Pathnames } from "../utils/consts";
import ItemLoader from "../stores/ItemLoader";

export default function ItemLoaderPage<L extends ItemLoader<any>>({view, children}: {
    view: L,
    children: ReactNode
}) {
    
    const params = useParams() as {[Pathnames.id]: string};

    view.prepareItem(params[Pathnames.id]);

    useEffect(() => {
        return () => view.resetRedirect();
    }, []);
    
    return <ItemRedirector view={view}>
        {children}
    </ItemRedirector>
}

const ItemRedirector = observer<{view: ItemLoader<any>, children: ReactNode}>(
    ({view, children}) => {

    const navigate = useNavigate();

    useEffect(() => {
        if (view.redirectPath) 
            navigate(view.redirectPath);

    }, [view.redirectPath]);

    return children;
})