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

function BooksFieldComponent({ field }: { field: BooksField }) {

    const { bookIdToDelete, bookSearchSettings, books, confirmDelete, removeBook } = field;

    useEffect(() => {
        return () => bookSearchSettings.reset();
    }, []);

    return <>
        <div className={formStyles.group}>

            <label htmlFor={field.id}>
                {field.label}
            </label>

            <p>{field.error}</p>

            <div className={formStyles.span}>
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
            className={formStyles.span}
        />

        {bookIdToDelete && <ConfirmationModal
            isPending={false}
            confirm={() => removeBook(bookIdToDelete)}
            close={() => confirmDelete(null)}
        >
            Sure you want to remove the book from author's books?

        </ConfirmationModal>}
    </>

}


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

export default observer(BooksFieldComponent);