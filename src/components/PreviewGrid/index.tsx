import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { DetailsConstraint as DC, PreviewConstraint as PC } from "../../utils/firestoreDbTypes";
import { EntityPreview, EntityPreviewComponent } from "../../utils/uiTypes";
import PreviewGridWrapper from "./PreviewGridWrapper";

function PreviewGrid<P extends PC, D extends DC>({
    previews, itemName, ItemPreview, children
}: {
    previews: EntityPreview<P, D>[],
    itemName: string,
    ItemPreview: EntityPreviewComponent<P, D>,
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