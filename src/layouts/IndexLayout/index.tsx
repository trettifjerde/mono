import { Outlet } from "react-router-dom";
import TabPanel from "./TabPanel";
import ControlPanel from "./ControlPanel";
import styles from './index.module.scss';

export default function IndexLayout() {

    return (<>
        <TabPanel />
        <ControlPanel />
        <div className={styles.cont}>
            <Outlet />
        </div>
    </>)
}