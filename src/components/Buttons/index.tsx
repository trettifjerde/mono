import { ButtonHTMLAttributes } from "react";
import { Link, LinkProps } from "react-router-dom";
import styles from './index.module.scss';
import common from '../../styles/common.module.scss';

export type ButtonColor = 'dark' | 'light' | 'blue' | 'black';
export type ButtonShape = 'square' | 'rect';

export type ButtonConfig = {
    color?: ButtonColor,
    shape?: ButtonShape
};
type IconProps<T> = Omit<T, 'children' | 'shape'> & {icon: string};
type TextIconProps<T> = IconProps<T> & {text: string};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonConfig;
type LinkButtonProps = LinkProps & ButtonConfig;

type IconButtonProps = IconProps<ButtonProps>;
type IconLinkButtonProps = IconProps<LinkButtonProps>;
type TextIconButtonProps = TextIconProps<ButtonProps>;


export function Button({
    children, 
    className="", 
    shape="rect",
    color="dark",
    ...props
}: ButtonProps) {

    const cls = `${styles.btn} ${styles[shape]} ${styles[color]} ${className}`;

    return <button {...props} className={cls}>
        {children}
    </button>
}

export function LoadingButton({loading, ...props}: ButtonProps & {loading: boolean}) {
    return <div className={loading ? common.shimmer : ''}>
        <Button {...props} />
    </div>
}

export function IconButton({icon, ...props}: IconButtonProps) {
    return <Button shape="square" type="button"
        {...props}
    >
        <i className={icon}/>
    </Button>
}

export function TextIconButton({icon, text, ...props}: TextIconButtonProps) {
    return <Button shape="rect"
        {...props}
    >
        <i className={icon} />
        <span>{text}</span>
    </Button>
}

export function LinkButton({children, color="dark", shape="rect", className="", ...props}: LinkButtonProps) {
    return <Link 
        className={`${common.linkBtn} ${styles.btn} ${styles[color]} ${styles[shape]} ${className}`} 
        {...props}
    >
        {children}
    </Link>
}

export function IconLinkButton({icon, ...props}: IconLinkButtonProps) {
    return <LinkButton
        shape="square"  
        {...props}
    >
        <i className={icon} />
    </LinkButton>
}