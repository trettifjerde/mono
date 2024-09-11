import { useCallback, useRef } from "react";
import { observer } from "mobx-react-lite";
import GridStore from "../../../stores/Grid/GridStore"
import { DetailsConstraint as DC, PreviewConstraint as PC } from "../../../utils/classes/Entity"
import { InputWithIconButton } from "../../../components/Inputs";

function SearchBar<P extends PC, D extends DC>({grid, className}: {
    grid: GridStore<P, D>
    className: string
}) {
    const ref = useRef<HTMLInputElement>(null);

    const clearInput = useCallback(() => {
        if (ref.current)
            ref.current.value = '';
    }, []);

    return <div className={className}>
        <label htmlFor="itemSearchBar">
            Search {grid.slice.entityName.toLowerCase() + 's'}
        </label>
        
        <InputWithIconButton 
            id="itemSearchBar"
            ref={ref}
            placeholder={`Start typing ${grid.entityTitleName}...`} 
            onBtnClick={clearInput}
        />
    </div>
}

export default observer(SearchBar);