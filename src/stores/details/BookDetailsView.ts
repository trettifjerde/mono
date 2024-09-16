import BookSlice from "../slices/BookSlice";
import { BookDetailsInfo, BookPreviewInfo } from "../../services/BookService";
import DetailsView from "./DetailsView";
import BookHeader from "../../pages/BookDetailsPage/BookHeader";
import DefaultBookImgSrc from '../../assets/800x800.webp';

export default class BookDetailsView extends DetailsView<BookPreviewInfo, BookDetailsInfo> {

    override fallbackImg = DefaultBookImgSrc;
    override HeaderComponent = BookHeader;

    constructor(slice: BookSlice) {

        super(slice);
    }

}