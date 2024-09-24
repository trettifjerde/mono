import { MouseEventHandler } from "react";
import { LoadingIconButton } from "../../../../components/Buttons";

export default function PagButton({icon, isLoading=false, isVisible, onClick}: {
    icon: string,
    isVisible: boolean, 
    isLoading?: boolean,
    onClick: MouseEventHandler
}) {
    
    return <LoadingIconButton 
        loading={isLoading}
        icon={icon} color="dark"
        style={isVisible ? {} : {visibility: 'hidden', opacity: 0}}
        onClick={onClick}
    />
}