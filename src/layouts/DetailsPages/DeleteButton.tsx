import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { IconButton } from "../../components/Buttons";
import Entity from "../../utils/classes/Entity";
import ConfirmationModal from "../../components/ConfirmationModal";

const DeleteButton = observer(<P, D,>({item}: {item: Entity<P,D>}) => {
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
            <p>Sure you want to delete {item.store.entityName.toLowerCase()} <b>{item.preview.name}</b>?</p>
        </ConfirmationModal>}
    </>
});

export default DeleteButton;