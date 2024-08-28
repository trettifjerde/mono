import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { PATHNAMES } from "./utils/consts";
import { IndexPageTab } from "./utils/types";
import { indexPageLoader } from "./utils/loaders";
import RootLayout from "./pages/RootLayout";
import IndexPage from "./pages/IndexPage";

export default function App() {

  return <RouterProvider router={router} />
}

const router = createBrowserRouter([
  {
    path: PATHNAMES.index,
    element: <RootLayout />,
    children: [
      {
        path: PATHNAMES.index,
        element: <IndexPage />,
        loader: indexPageLoader(IndexPageTab.books)
      },
      {
        path: PATHNAMES.authors,
        element: <IndexPage  />,
        loader: indexPageLoader(IndexPageTab.authors)
      }
    ]
  }
]);