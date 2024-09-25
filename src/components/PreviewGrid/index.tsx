import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { EntityPreviewComponent } from "../../utils/uiTypes";
import Entity from "../../utils/classes/Entity";
import PreviewGridWrapper from "./PreviewGridWrapper";
import PreviewItem from "./PreviewItem";

function PreviewGrid<E extends Entity>({
    items, isLoading, itemName, ItemPreview, onItemClick, children, className
}: {
    items: E[],
    isLoading: boolean,
    itemName: string,
    ItemPreview: EntityPreviewComponent<E>,
    onItemClick?: (item: E) => void,
    children?: ReactNode,
    className?: string
}) {

    if (isLoading)
        return <SkeletonGrid className={className} />

    if (!items.length)
        return <EmptyGrid className={className} itemName={itemName} >
            {children}
        </EmptyGrid>

    return <PreviewGridWrapper 
        type="grid" 
        className={className}
    >
        {items.map(item => (
            <ItemPreview
                key={item.id}
                item={item}
                onItemClick={onItemClick}
            />))
        }
        {children}

    </PreviewGridWrapper>
}

export default observer(PreviewGrid);

function SkeletonGrid({className}: {className?: string}) {
    return <PreviewGridWrapper 
            type="skeleton" 
            className={className}
        >

            <PreviewItem skeleton />
            <PreviewItem skeleton />
            <PreviewItem skeleton />
            <PreviewItem skeleton />

        </PreviewGridWrapper>
}

function EmptyGrid({className, itemName, children}: {
    itemName: string,
    className?: string,
    children?: ReactNode
}) {
    return <PreviewGridWrapper 
        type="empty" 
        className={className}
    >

        <span>No {itemName.toLowerCase() + 's'}</span>
        
        {children}

    </PreviewGridWrapper>
}