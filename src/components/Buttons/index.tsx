import { ButtonHTMLAttributes } from "react";
import styles from './index.module.scss';
import { Link, LinkProps } from "react-router-dom";

type ButtonColor = 'dark' | 'light';
type ButtonShape = 'square' | 'rect';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: ButtonColor,
    shape?: ButtonShape
};
type IconButtonProps = Omit<ButtonProps, 'children' | 'shape'> & {icon: string};
type TextIconButton = IconButtonProps & {text: string};
type LinkButtonProps = LinkProps & {color?: ButtonColor, shape?: ButtonShape}

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

export function LinkButton({children, color="dark", shape="rect", className="", ...props}: LinkButtonProps) {
    return <Link 
        className={`${styles.btn} ${styles[color]} ${styles[shape]} ${className}`} 
        {...props}
    >
        {children}
    </Link>
}