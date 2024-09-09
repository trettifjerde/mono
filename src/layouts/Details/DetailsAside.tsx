import { ReactNode } from "react";

export default function DetailsAside({children}: {children: ReactNode}) {
    return <aside>
        {children}
    </aside>
}