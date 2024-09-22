import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import BooksField from "../../../stores/FormView/fields/BooksField";
import DynamicSelect from "../../../components/DynamicSelect";
import PreviewGrid from '../../../components/PreviewGrid';
import formStyles from '../common/form.module.scss';
import authorStyles from './author.module.scss'
import ConfirmationModal from "../../../components/ConfirmationModal";
import AuthorFormBookPreview from "./AuthorFormBookPreview";

function BookComponent({field}: {field: BooksField}) {

    const {bookIdToDelete, bookSearchSettings, books, confirmDelete, removeBook} = field;

    useEffect(() => {
        return () => bookSearchSettings.clear();
    }, []);

    return <div className={formStyles.group}>

        <label htmlFor={field.id}>
            {field.label}
        </label>

        <p>{field.error}</p>

        <DynamicSelect 
            id="bookSearch"
            label="Search for books without authors to add more books"
            entityTitleName="book title"
            settings={bookSearchSettings}
            className={authorStyles.span}
        />

        <PreviewGrid 
            isLoading={field.view.isInitialising}
            items={books}
            itemName='book'
            ItemPreview={AuthorFormBookPreview}
            onItemClick={confirmDelete}
            className={authorStyles.span} 
        />

        {bookIdToDelete && <ConfirmationModal
            isPending={false}
            confirm={() => removeBook(bookIdToDelete)}
            close={() => confirmDelete(null)}
        >
            Sure you want to remove the book from author's books?

        </ConfirmationModal>}

    </div>
}

export default observer(BookComponent);