import { MouseEventHandler } from "react";
import { IconButton } from "../../../../components/Buttons";

export default function PagButton({icon, isVisible, onClick}: {
    icon: string,
    isVisible: boolean, 
    onClick: MouseEventHandler
}) {
    
    return <IconButton 
        icon={icon}
        style={isVisible ? {} : {visibility: 'hidden', opacity: 0}}
        onClick={onClick}
    />
}