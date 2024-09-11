import Entity, { DetailsConstraint as DC, PreviewConstraint as PC } from "./classes/Entity";

export type DropdownOption = {
    value: string,
    text: string
}

export type DropdownOptionSelectHandler = (option: DropdownOption | null) => void;

export type SelectOptionsConfig<T extends DropdownOption> =  {
    defaultOptions: T[],
    dynamic: false,
} | {
    getOptions: (arg: string) => Promise<T[] | null>,
    dynamic: true
};

export type EntityPreview<P extends PC, D extends DC> = Entity<P, D>['preview'];

export type EntityPreviewComponent<P extends PC, D extends DC> = (props: {
    preview: EntityPreview<P, D>
}) => JSX.Element;