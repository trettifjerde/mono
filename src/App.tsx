import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Pathnames } from "./utils/consts";
import { authorLoader, authorsPageLoader, bookLoader, indexPageLoader } from "./utils/loaders";

import RootLayout from "./layouts/RootLayout";
import IndexLayout from "./layouts/IndexLayout";
import DetailsLayout from "./layouts/DetailsLayout";

import IndexPage from "./pages/IndexPage";
import AuthorsPage from "./pages/AuthorsPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import AuthorDetailsPage from "./pages/AuthorDetailsPage";
import RootError from "./layouts/RootLayout/RootError";
import DetailsNotFound from "./layouts/DetailsLayout/DetailsNotFound";

export default function App() {

  return <RouterProvider router={router} />
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RootError />,
    children: [
      {
        element: <IndexLayout />,
        children: [
          {
            index: true,
            element: <IndexPage />,
            loader: indexPageLoader
          },
          {
            path: Pathnames.authors,
            element: <AuthorsPage />,
            loader: authorsPageLoader
          },
        ]
      },
      {
        element: <DetailsLayout />,
        errorElement: <DetailsNotFound />,
        children: [
          {
            path: Pathnames.books,
            children: [
              {
                path: `:${Pathnames.bookId}`,
                element: <BookDetailsPage />,
                loader: bookLoader
              }
            ]
          },
          {
            path: Pathnames.authors,
            children: [
              {
                path: `:${Pathnames.authorId}`,
                element: <AuthorDetailsPage />,
                loader: authorLoader
              }
            ]

          }
        ]
      }
    ]
  }
]
);