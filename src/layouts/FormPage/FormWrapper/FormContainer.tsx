import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import FormView from "../../../stores/FormView/FormView";
import FormButtons from "./FormButtons";
import common from '../../../styles/common.module.scss';

function FormContainer({ view, children }: { view: FormView, children: ReactNode }) {

    return <form className={view.isInitialising ? common.shimmer : ''}>

        {children}

        <FormButtons view={view} />

    </form>
}

export default observer(FormContainer);