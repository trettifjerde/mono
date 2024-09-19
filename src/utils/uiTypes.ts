import Entity from "./classes/Entity";

export type Suggestion<Key extends string> = {
    text: string,
    value: Key
};

export type DropdownOption<T extends string> = Suggestion<T> & {
    renderElement: () => JSX.Element
}

export type DropdownOptionSelectHandler<T extends string> = (option: DropdownOption<T> | null) => void;

export type EntityPreviewComponent<E extends Entity<any, any>> = (props: {
    preview: E['preview']
}) => JSX.Element;