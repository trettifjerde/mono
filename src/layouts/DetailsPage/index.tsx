import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { IconLinkButton } from "../../components/Buttons";
import Entity from "../../utils/classes/Entity";
import DetailsView from "../../stores/DetailsView/DetailsView";
import DetailsMain from "./DetailsMain";
import DeleteButton from "./DeleteButton";
import styles from './index.module.scss';
import common from '../../styles/common.module.scss';

function DetailsPage<E extends Entity>(
    { view, className, children }:
        {
            view: DetailsView<E>,
            className: string,
            children?: ReactNode
        }) {

    const { isInitialising, isFailure, loadedItem, HeaderComponent } = view;

    return <article className={`${styles.base} ${className} ${isInitialising ? common.shimmer : ''}`}>

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
                {loadedItem && <DeleteButton item={loadedItem} view={view} /> }
            </li>
        </menu>

        <figure className={isFailure ? styles.bleak : ''}>
            <img 
                src={loadedItem?.img || view.fallbackImg} 
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