import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import DetailsView from "../../stores/details/DetailsView";
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../utils/firestoreDbTypes";
import { getSkeletonClassIfNeeded } from "../../utils/helpers";
import { IconLinkButton } from "../../components/Buttons";
import DetailsMain from "./DetailsMain";
import DeleteButton from "./DeleteButton";
import styles from './index.module.scss';

function DetailsPage<P extends PC, D extends DC>(
    { details, className, children }:
        {
            details: DetailsView<P, D>,
            className: string,
            children?: ReactNode
        }) {

    const { isLoading, isFailure, loadedItem, HeaderComponent } = details;

    return <article className={`${styles.base} ${className} ${getSkeletonClassIfNeeded(isLoading)}`}>

        <header>
            <hgroup>
                <h1>{details.headerContent}</h1>
                {HeaderComponent && <HeaderComponent item={details.loadedItem} />}
            </hgroup>        
        </header>

        <menu>
            <li>
                {loadedItem && <IconLinkButton to="edit" icon="icon-edit" color="blue"/>}
            </li>
            <li>
                {loadedItem && <DeleteButton item={loadedItem} /> }
            </li>
        </menu>

        <figure className={isFailure ? styles.bleak : ''}>
            <img 
                src={loadedItem?.preview.img || details.fallbackImg} 
                alt="Decorative image"
            />
        </figure>

        <DetailsMain details={details} />

        <aside>
            {children}
        </aside>
    </article>
}

export default observer(DetailsPage);