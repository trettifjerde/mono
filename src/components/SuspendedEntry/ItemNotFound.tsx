import { useAsyncError } from "react-router-dom";

export default function ItemNotFound() {
    const error = useAsyncError() as Error;

    return <div>{error.message}</div>
}