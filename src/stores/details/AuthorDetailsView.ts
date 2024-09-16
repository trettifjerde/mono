import DetailsView from "./DetailsView";
import AuthorSlice from "../slices/AuthorSlice";
import { AuthorDetailsInfo, AuthorPreviewInfo } from "../../services/AuthorService";
import DefaultBookImgSrc from '../../assets/800x800.webp';
import Author from "../../utils/classes/Author";

export default class AuthorDetailsView extends DetailsView<AuthorPreviewInfo, AuthorDetailsInfo> {

    override loadedItem: Author | null = null;
    override fallbackImg = DefaultBookImgSrc;
    override HeaderComponent = null;

    constructor(slice: AuthorSlice) {

        super(slice);
    }

    get books() {
        return this.loadedItem?.books || [];
    }

    

}