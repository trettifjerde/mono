import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { EntityPreviewComponent } from "../../utils/uiTypes";
import Entity from "../../utils/classes/Entity";
import PreviewGridWrapper from "./PreviewGridWrapper";

function PreviewGrid<E extends Entity<any, any>>({
    previews, itemName, ItemPreview, children
}: {
    previews: E['preview'][],
    itemName: string,
    ItemPreview: EntityPreviewComponent<E>,
    children?: ReactNode
}) {

    const isEmpty = !previews.length;

    return <PreviewGridWrapper type={isEmpty ? 'empty' : 'grid'}>

        {previews.map(preview => (
            <ItemPreview 
                key={preview.id} 
                preview={preview} 
            />))
        }

        {isEmpty && <span>No {itemName.toLowerCase() + 's'}</span>}

        {children}
        
    </PreviewGridWrapper>
}
export default observer(PreviewGrid);