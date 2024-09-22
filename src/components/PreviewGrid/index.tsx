import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { EntityPreviewComponent } from "../../utils/uiTypes";
import Entity from "../../utils/classes/Entity";
import PreviewGridWrapper from "./PreviewGridWrapper";
import PreviewItemWrapper from "./PreviewItemWrapper";

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

        return <PreviewGridWrapper 
            type="skeleton" 
            className={className}
        >

            <PreviewItemWrapper isLoading />
            <PreviewItemWrapper isLoading />
            <PreviewItemWrapper isLoading />
            <PreviewItemWrapper isLoading />

        </PreviewGridWrapper>

    if (!items.length)

        return <PreviewGridWrapper 
            type="empty" 
            className={className}
        >

            <span>No {itemName.toLowerCase() + 's'}</span>
            {children}

        </PreviewGridWrapper>


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