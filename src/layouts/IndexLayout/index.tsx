import { Outlet } from "react-router-dom";
import TabPanel from "./TabPanel";
import ControlPanel from "./ControlPanel";

export default function IndexLayout() {

    return (<>
        <TabPanel />
        <ControlPanel />
        <Outlet />
    </>)
}