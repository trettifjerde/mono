import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { getSkeletonClassIfNeeded } from "../../utils/helpers";
import { IconLinkButton } from "../../components/Buttons";
import DetailsView from "../../stores/details/DetailsView";
import DetailsMain from "./DetailsMain";
import DeleteButton from "./DeleteButton";
import styles from './index.module.scss';

function DetailsPage<P, D>(
    { view, className, children }:
        {
            view: DetailsView<P, D>,
            className: string,
            children?: ReactNode
        }) {

    const { isLoading, isFailure, loadedItem, HeaderComponent } = view;

    return <article className={`${styles.base} ${className} ${getSkeletonClassIfNeeded(isLoading)}`}>

        <header>
            <hgroup>
                <h1>{view.headerContent}</h1>
                {HeaderComponent && <HeaderComponent item={view.loadedItem} />}
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
                src={loadedItem?.preview.img || view.fallbackImg} 
                alt="Decorative image"
            />
        </figure>

        <DetailsMain view={view} />

        <aside>
            {children}
        </aside>
    </article>
}

export default observer(DetailsPage);