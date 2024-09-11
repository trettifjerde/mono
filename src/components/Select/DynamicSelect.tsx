// import GridStore from "../../stores/Grid/GridStore";
// import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../utils/classes/Entity";
// export default function DynamicSelect({grid}: {grid: GridStore}) {
    
//     const dropdownList = function(){

//         if (isFetching)
//             return <li className={styles.loading}>
//                 Loading...
//             </li>

//         if (!options)
//             return null;

//         if (!options.length)
//             return <li className={styles.empty}>
//                 No results
//             </li>

//         return options.map(option => (<li
//             key={option.value}
//             onClick={() => selectDropdownOption(option)}
//         >
//             {option.text}
//         </li>))
//     }();
    

//     const selectDropdownOption = useCallback((option: DropdownOption | null) => {
//         if (ddOpenerRef.current)
//             ddOpenerRef.current.value = option ? option.text : '';
        
//         selectOption(option);

//         if (dropdownConfig.dynamic) 
//             dispatch({
//                 type: Actions.setOptions, 
//                 results: null
//             })
//     }, [dropdownConfig, selectOption]);

//     const onInputChange = useCallback(async (filterStr: string) => {
//         if (dropdownConfig.dynamic) {
//             dispatch({
//                 type: Actions.startFetching 
//             });

//             const results = await dropdownConfig.getOptions(filterStr);

//             dispatch({ 
//                 type: Actions.setOptions, 
//                 results 
//             });
//         }
//     }, [dropdownConfig]);

// }