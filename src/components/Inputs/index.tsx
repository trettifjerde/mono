import { forwardRef, InputHTMLAttributes, MouseEventHandler } from 'react';
import { IconButton } from '../Buttons';
import styles from './index.module.scss';

type InputProps<T> = InputHTMLAttributes<HTMLInputElement> & { id: string } & T;

export type InputWithIconButtonProps = InputProps<{
    icon?: string,
    onBtnClick: MouseEventHandler<HTMLButtonElement>
}>;

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    (props, ref) => {
        return <input {...props} ref={ref} />
    }
);

export const InputWithIconButton = forwardRef<HTMLInputElement, InputWithIconButtonProps>(
    ({ onBtnClick, icon = 'icon-cross', ...props }, ref) => {

    return <div className={styles.btninp}>
        <Input ref={ref} {...props} />
        <IconButton
            icon={icon}
            color={'light'}
            onClick={onBtnClick}
        />
    </div>;
});