import { ButtonHTMLAttributes } from "react";
import styles from './index.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: 'dark' | 'light',
    shape?: 'square' | 'rect'
};
type IconButtonProps = Omit<ButtonProps, 'children' | 'shape'> & {icon: string};
type TextIconButton = IconButtonProps & {text: string};

export function Button({
    children, 
    className="", 
    shape="rect",
    color="dark",
    ...props
}: ButtonProps) {

    const cls = `${styles.btn} ${styles[shape]} ${styles[color]} ${className}`;

    return <button className={cls} {...props}>
        {children}
    </button>
}

export function IconButton({icon, ...props}: IconButtonProps) {
    return <Button shape="square"
        {...props}
    >
        <i className={icon}/>
    </Button>
}

export function TextIconButton({icon, text, ...props}: TextIconButton) {
    return <Button shape="rect"
        {...props}
    >
        <i className={icon} />
        <span>{text}</span>
    </Button>
}