
import { observer } from "mobx-react-lite";
import PreviewGridWrapper from "./PreviewGridWrapper";
import { EntityPreview, EntityPreviewComponent } from "../../utils/uiTypes";
import { DetailsConstraint as DC, PreviewConstraint as PC } from "../../utils/classes/Entity";

function PreviewGrid<P extends PC, D extends DC>({previews, ItemPreview, itemName}: {
    previews: EntityPreview<P, D>[],
    ItemPreview: EntityPreviewComponent<P, D>,
    itemName: string
}) {
    return <PreviewGridWrapper>

        {previews.map(preview => <ItemPreview key={preview.id} preview={preview} />)}
        {!previews.length && <span>No {itemName.toLowerCase() + 's'}</span>}

    </PreviewGridWrapper>
}

export default observer(PreviewGrid);