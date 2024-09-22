import { Outlet } from "react-router-dom";
import TabPanel from "./TabPanel";

export default function PreviewsLayout() {
    return (<>
        <TabPanel />
        <Outlet />
    </>)
}