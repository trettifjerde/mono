import { useState } from "react";
import { IconButton, IconLinkButton } from "../Buttons";
import ConfirmationModal from "../ConfirmationModal";

export default function DetailsMenu({id}: {id?: string}) {
    
    return <menu>
        <li>
            {id && <IconLinkButton to="edit" icon="icon-edit" color="blue"/>}
        </li>
        <li>
            {id && <DeleteButton id={id} />}
        </li>
    </menu>
}

function DeleteButton({id}: {id: string}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return <>
        <IconButton icon="icon-bin" color="black" onClick={() => setIsModalOpen(true)}/>
        
        {isModalOpen && <ConfirmationModal 
            close={() => setIsModalOpen(false)}
            confirm={() => console.log(id, 'deleted')}
        >
            <p>Delete?</p>
        </ConfirmationModal>}
    </>
}