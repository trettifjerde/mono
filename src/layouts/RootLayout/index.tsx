import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import styles from './index.module.scss'

export default function RootLayout() {
    return (<div className={styles.root}>
        <Navigation />
        <main className={styles.main}>
            <Outlet />
        </main>
        <Footer />
    </div>)
}