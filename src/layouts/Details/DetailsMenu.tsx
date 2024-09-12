import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import DetailsStore from "../../stores/DetailsStore";
import { PreviewConstraint as PC, DetailsConstraint as DC } from '../../utils/firestoreDbTypes';
import Entity from "../../utils/classes/Entity";
import { getSkeletonClassIfNeeded } from "../../utils/helpers";
import { IconButton, IconLinkButton } from '../../components/Buttons';
import ConfirmationModal from "../../components/ConfirmationModal";

function DetailsMenu<P extends PC, D extends DC>({details}: {details: DetailsStore<P,D>}) {

    const {isLoading, loadedItem : item} = details;
    
    return <menu className={getSkeletonClassIfNeeded(isLoading)}>
        <li>
            {item && <IconLinkButton to="edit" icon="icon-edit" color="blue"/>}
        </li>
        <li>
            {item && <DeleteButton item={item} /> }
        </li>
    </menu>
}

const DeleteButton = observer(<P extends PC, D extends DC,>({item}: {item: Entity<P,D>}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsModalOpen(false);
    }, [item]);

    return <>
        <IconButton icon="icon-bin" color="black" onClick={() => setIsModalOpen(true)}/>
        
        {isModalOpen && <ConfirmationModal 
            close={() => setIsModalOpen(false)}
            confirm={() => console.log(item.id, 'deleted')}
        >
            <p>Are you want to delete {item.store.slice.entityName.toLowerCase()} <b>{item.preview.name}</b>?</p>
        </ConfirmationModal>}
    </>
})

export default observer(DetailsMenu);