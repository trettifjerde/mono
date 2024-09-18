import Entity from "./classes/Entity";
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../utils/firestoreDbTypes';

export type DropdownOption<T extends string> = {
    value: T,
    text: string,
    element: JSX.Element
}

export type DropdownOptionSelectHandler<T extends string> = (option: DropdownOption<T> | null) => void;

export type EntityPreviewComponent<P extends PC, D extends DC> = (props: {
    preview: Entity<P, D>['preview']
}) => JSX.Element;