import { ButtonHTMLAttributes } from "react";
import { Link, LinkProps } from "react-router-dom";
import styles from './index.module.scss';
import common from '../../styles/common.module.scss';

export type ButtonColor = 'dark' | 'purple' | 'blue' | 'black' | 'trans';

export type ButtonConfig = {
    color?: ButtonColor,
    square?: boolean
};
type IconProps<T> = Omit<T, 'children' | 'shape'> & {icon: string};
type TextIconProps<T> = IconProps<T> & {text: string};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonConfig;
type LinkButtonProps = LinkProps & ButtonConfig;

type IconButtonProps = IconProps<ButtonProps>;
type IconLinkButtonProps = IconProps<LinkButtonProps>;
type TextIconButtonProps = TextIconProps<ButtonProps>;

function getBtnCls({square, className="", color="trans"}: ButtonConfig & {className?: string}) {
    return `${styles.btn} ${square ? styles.square : ''} ${styles[color]} ${className}`
}

export function Button({
    children, 
    square=false,
    color,
    className, 
    ...props
}: ButtonProps) {

    return <button {...props} className={getBtnCls({square, className, color})}>
        {children}
    </button>
}

export function LoadingButton({loading, ...props}: ButtonProps & {loading: boolean}) {
    return <div className={loading ? common.shimmer : ''}>
        <Button {...props} />
    </div>
}

export function IconButton({icon, ...props}: IconButtonProps) {
    return <Button type="button" square {...props}>
        <i className={icon}/>
    </Button>
}

export function LoadingIconButton({loading, ...props}: IconButtonProps & {loading: boolean}) {
    return <div className={loading ? common.shimmer : ''}>
        <IconButton {...props} />
    </div>
}

export function TextIconButton({icon, text, ...props}: TextIconButtonProps) {
    return <Button {...props}
    >
        <i className={icon} />
        <span>{text}</span>
    </Button>
}

export function LinkButton({children, square, color, className, ...props}: LinkButtonProps) {
    return <Link 
        className={`${common.linkBtn} ${getBtnCls({square, className, color})}`} 
        {...props}
    >
        {children}
    </Link>
}

export function IconLinkButton({icon, ...props}: IconLinkButtonProps) {
    return <LinkButton
        square  
        {...props}
    >
        <i className={icon} />
    </LinkButton>
}