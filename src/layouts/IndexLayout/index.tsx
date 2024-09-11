import { Outlet } from "react-router-dom";
import TabPanel from "./TabPanel";

export default function IndexLayout() {

    return (<>
        <TabPanel />
        <Outlet />
    </>)
}