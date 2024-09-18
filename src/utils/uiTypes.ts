import Entity from "./classes/Entity";

export type DropdownOption<T extends string> = {
    value: T,
    text: string,
    element: JSX.Element
}

export type DropdownOptionSelectHandler<T extends string> = (option: DropdownOption<T> | null) => void;

export type EntityPreviewComponent<E extends Entity<any, any>> = (props: {
    preview: E['preview']
}) => JSX.Element;