import { BookPreviewInfo } from "../../utils/firestoreDbTypes";
import { BookDetailsInfo } from "../../utils/classes/Book";
import BookStore from "../data/BookStore";
import DetailsView from "./DetailsView";
import BookHeader from "../../pages/BookDetailsPage/BookHeader";
import DefaultBookImgSrc from '../../assets/800x800.webp';

export default class BookDetailsView extends DetailsView<BookPreviewInfo, BookDetailsInfo> {

    override store : BookStore;
    override fallbackImg = DefaultBookImgSrc;
    override HeaderComponent = BookHeader;

    constructor(store: BookStore) {
        super();
        
        this.store = store;
    }

}