import styles from './root.module.scss';

export default function Footer() {
    return <footer className={styles.footer}>
        <div>
            Made by&nbsp;
            <a href='https://github.com/trettifjerde' target='_blank'>trettifjerde</a> 
            &nbsp;for&nbsp;
            <a href='https://mono.software/' target='_blank'>Mono Software</a>
        </div>
    </footer>
}