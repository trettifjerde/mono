import { ReactNode } from "react";
import Entity from "./classes/Entity";

export type Suggestion<Key extends string> = {
    text: string,
    value: Key
};

export type DropdownOption<T extends string> = Suggestion<T> & {
    renderElement: () => JSX.Element
}

export type DropdownOptionSelectHandler<T extends string> = (option: DropdownOption<T>) => void;

export type EntityPreviewComponent<E extends Entity> = (props: {
    item: E,
    isLink?: boolean,
    className?: string,
    onItemClick?: (item: E) => void,
    children?: ReactNode
}) => JSX.Element;