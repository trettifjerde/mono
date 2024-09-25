import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { IconButton } from "../../components/Buttons";
import Entity from "../../utils/classes/Entity";
import ConfirmationModal from "../../components/ConfirmationModal";
import DetailsView from "../../stores/DetailsView/DetailsView";

const DeleteButton = observer(<E extends Entity,>({item, view}: {
    item: E,
    view: DetailsView<E>
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsModalOpen(false);
    }, [item]);

    return <>
        <IconButton icon="icon-bin" color="black" onClick={() => setIsModalOpen(true)}/>
        
        {isModalOpen && <ConfirmationModal 
            close={() => setIsModalOpen(false)}
            isPending={view.isPending}
            confirm={() => view.deleteItem(item)}
        >
            <p>Sure you want to delete <b>{item.preview.name}</b>?</p>
        </ConfirmationModal>}
    </>
});

export default DeleteButton;