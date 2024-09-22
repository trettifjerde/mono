import { forwardRef, InputHTMLAttributes, MouseEventHandler } from 'react';
import { ButtonColor, IconButton } from '../Buttons';
import styles from './index.module.scss';

type InputProps<T> = InputHTMLAttributes<HTMLInputElement> & { id: string } & T;

export type InputWithIconButtonProps = InputProps<{
    onBtnClick: MouseEventHandler<HTMLButtonElement>
    hiddenWhenBlurred?: boolean,
    icon?: string,
    color?: ButtonColor,
}>;

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    (props, ref) => {
        return <input {...props} ref={ref} />
    }
);

export const InputWithIconButton = forwardRef<HTMLInputElement, InputWithIconButtonProps>(
    ({ 
        onClick, onBtnClick, className, hiddenWhenBlurred=true, 
        color='light', icon = 'icon-cross', ...props 
    }, ref) => {

    let cls = `${styles.btninp} ${className || ''}`;

    const noPropagationOnBtnClick : MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        onBtnClick(e);
    }

    return <div className={cls}
        onClick={onClick}
    >
        <Input ref={ref} {...props} />
        <IconButton
            icon={icon}
            color={color}
            className={hiddenWhenBlurred ? styles.hwb : ''}
            onClick={noPropagationOnBtnClick}
        />
    </div>;
});