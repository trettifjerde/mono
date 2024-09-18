import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { DetailsConstraint, PreviewConstraint } from "../../utils/firestoreDbTypes";
import { EntityPreviewComponent } from "../../utils/uiTypes";
import Entity from "../../utils/classes/Entity";
import PreviewGridWrapper from "./PreviewGridWrapper";

function PreviewGrid<P extends PreviewConstraint, D extends DetailsConstraint>({
    previews, itemName, ItemPreview, children
}: {
    previews: Entity<P,D>['preview'][],
    itemName: string,
    ItemPreview: EntityPreviewComponent<P,D>,
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