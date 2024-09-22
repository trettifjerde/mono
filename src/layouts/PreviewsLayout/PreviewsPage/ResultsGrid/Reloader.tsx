import { Button } from "../../../../components/Buttons";
import PreviewGridWrapper from "../../../../components/PreviewGrid/PreviewGridWrapper";
import styles from './index.module.scss';

function Reloader({ entityName, loadPreviews }: { 
    entityName: string, 
    loadPreviews: () => void,
}) {

    return <PreviewGridWrapper 
        type='empty'
        className={styles.grid}
    >
        <div>
            Failed to fetch {entityName.toLowerCase() + 's'}
        </div>
        
        <Button onClick={loadPreviews}>
            Try again
        </Button>
    </PreviewGridWrapper>
};

export default Reloader;