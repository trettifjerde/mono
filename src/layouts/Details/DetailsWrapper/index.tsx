import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import DetailsStore from "../../../stores/DetailsStore";
import { PreviewConstraint as PC, DetailsConstraint as DC } from "../../../utils/classes/Entity";
import { getSkeletonClassIfNeeded } from "../../../utils/helpers";
import DetailsAside from "../DetailsAside";
import DetailsHeader from "../DetailsHeader";
import DetailsImage from "../DetailsImage";
import DetailsMain from "../DetailsMain";
import DetailsMenu from "../DetailsMenu";
import styles from './index.module.scss';

function DetailsWrapper<P extends PC, D extends DC>(
    { currentId, details, className, fallbackImg, HeaderComponent, children }:
    {
        currentId: string,
        details: DetailsStore<P,D>,
        className: string,
        fallbackImg: string,
        HeaderComponent?: (props: { item: DetailsStore<P,D>['loadedItem'] }) => JSX.Element,
        children?: ReactNode
    }) {

    if (details.selectedId !== currentId) 
        details.prepareItem(currentId);

    return <article className={`${styles.base} ${className} ${getSkeletonClassIfNeeded(details.isLoading)}`}>

        <DetailsHeader details={details}>
            {HeaderComponent && <HeaderComponent item={details.loadedItem} />}
        </DetailsHeader>

        <DetailsMenu details={details} />

        <DetailsImage
            details={details}
            fallbackImg={fallbackImg}
            errorClassName={styles.bleak}
        />

        <DetailsMain details={details} />

        <DetailsAside>
            {children}
        </DetailsAside>
    </article>
}

export default observer(DetailsWrapper);