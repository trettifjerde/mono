import { Outlet } from "react-router-dom";
import RootWrapper from "./RootWrapper";

export default function RootLayout() {
    return <RootWrapper>
        <Outlet />
    </RootWrapper>
}
