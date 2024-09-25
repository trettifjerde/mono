import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { EntityPreviewComponent } from "../../utils/uiTypes";
import Book from "../../utils/classes/Book";
import BooksField from "../../stores/FormView/fields/BooksField";
import ConfirmationModal from "../../components/ConfirmationModal";
import DynamicSelect from "../../components/DynamicSelect";
import PreviewGrid from '../../components/PreviewGrid';
import BookPreview from "../../components/BookPreview";
import formStyles from '../../layouts/FormPage/form.module.scss';
import authorStyles from './author.module.scss'

const BooksFieldComponent = observer<{ field: BooksField }>(({field}) => {

    const { booktoDelete, bookSearchSettings, books, confirmDelete, removeBook } = field;

    useEffect(() => {
        return () => bookSearchSettings.resetSettings();
    }, []);

    return <>
        <div className={formStyles.group}>

            <label htmlFor={field.id}>
                <span>
                    {field.label}
                </span>
                <span>(optional)</span>
            </label>

            <p>{field.error}</p>

            <div className={formStyles.colspan}>
                
                <label htmlFor={field.id}>
                    Search for books with no author to add more books
                </label>

                <DynamicSelect
                    id={field.id}
                    placeholderWord="book title"
                    settings={bookSearchSettings}
                />
            </div>

        </div>

        <PreviewGrid
            isLoading={field.view.isInitialising}
            items={books}
            itemName='book'
            ItemPreview={AuthorFormBookPreview}
            onItemClick={confirmDelete}
            className={formStyles.colspan}
        />

        {booktoDelete && <ConfirmationModal
            isPending={false}
            confirm={() => removeBook(booktoDelete.id)}
            close={() => confirmDelete(null)}
        >
            Sure you want to remove <b>{booktoDelete.name}</b> from author's books?

        </ConfirmationModal>}
    </>

});

export default BooksFieldComponent;

const AuthorFormBookPreview: EntityPreviewComponent<Book> = (
    { item, onItemClick }) => {

    return <BookPreview
        item={item}
        isLink={false}
        className={authorStyles.preview}
    >
        <div
            className={authorStyles.dltBtn}
            onClick={onItemClick ? () => onItemClick(item) : undefined}
        >
            <i className="icon-bin" />
        </div>

    </BookPreview>
}