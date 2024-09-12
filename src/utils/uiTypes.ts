import Entity from "./classes/Entity";
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../utils/firestoreDbTypes';

export type DropdownOption<T> = {
    value: T,
    text: string
}

export type DropdownOptionSelectHandler<T> = (option: DropdownOption<T> | null) => void;

export type EntityPreview<P extends PC, D extends DC> = Entity<P, D>['preview'];

export type EntityPreviewComponent<P extends PC, D extends DC> = (props: {
    preview: EntityPreview<P, D>
}) => JSX.Element;