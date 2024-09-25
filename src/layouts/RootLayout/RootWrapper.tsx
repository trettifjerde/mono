import { ReactNode } from "react";
import Footer from "./Footer";
import Navigation from "./Navigation";
import styles from './root.module.scss';

export default function RootWrapper({children}: {children: ReactNode}) {
    return (<div className={styles.root}>
        <Navigation />
        <main className={styles.main}>
            {children}
        </main>
        <Footer />
    </div>)
}