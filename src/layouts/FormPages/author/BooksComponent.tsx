import { observer } from "mobx-react-lite";
import { Field } from "mobx-react-form";
import AuthorFormView from "../../../stores/FormView/AuthorFormView";
import DynamicSelect from "../../../components/DynamicSelect";
import PreviewGrid from '../../../components/PreviewGrid';
import BookPreviewItem from "../../../components/PreviewGrid/BookPreviewItem";
import formStyles from '../common/form.module.scss';
import authorStyles from './author.module.scss'

function BookComponent({field, view}: {
    field: Field,
    view: AuthorFormView
}) {

    return <div className={formStyles.group}>

        <label htmlFor={field.id}>
            {field.label}
        </label>

        <p>{field.error}</p>

        <div className={authorStyles.addMore}>
            <DynamicSelect 
                id="bookSearch"
                label="Search for books without authors to add more books"
                entityTitleName="book title"
                settings={view.bookSearchSettings}
            />
        </div>

        <PreviewGrid 
            className={authorStyles.books} 
            previews={view.bookPreviews}
            itemName='book'
            ItemPreview={BookPreviewItem}
        >
        </PreviewGrid>


    </div>
}

export default observer(BookComponent);