import { useRouteError } from "react-router-dom";

export default function ErrorElement() {
    const error = useRouteError() as Error;
  
    return <div>{error.message || 'Oops! An error has occurred'}</div>;
}