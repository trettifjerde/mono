import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Pathnames } from "./utils/consts";

import RootLayout from "./layouts/RootLayout";
import RootError from "./layouts/RootLayout/RootError";
import IndexLayout from "./layouts/IndexLayout";

import IndexPage from "./pages/IndexPage";
import AuthorsPage from "./pages/AuthorsPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import AuthorDetailsPage from "./pages/AuthorDetailsPage";

import { useContext } from "react";
import { RootStoreContext } from "./stores/StoreContext";
import NewAuthorPage from "./pages/NewAuthorPage";

export default function App() {

  const rootStore = useContext(RootStoreContext);

  return <RootStoreContext.Provider value={rootStore}>
    <RouterProvider router={router} />
  </RootStoreContext.Provider>
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
            element: <IndexPage />
          },
          {
            path: Pathnames.authors,
            element: <AuthorsPage />
          },
        ]
      },
      {
        // Routes below do not share layouts,
        // but they share rendering logic and wrapper components from layouts/[...]Pages
        children: [
          {
            path: Pathnames.books,
            children: [
              {
                path: `:${Pathnames.bookId}`,
                element: <BookDetailsPage />,
              }
            ]
          },
          {
            path: Pathnames.authors,
            children: [
              {
                path: 'new',
                element: <NewAuthorPage />
              },
              {
                path: `:${Pathnames.authorId}`,
                element: <AuthorDetailsPage />,
              },
            ]
          }
        ]
      }
    ]
  }
]
);