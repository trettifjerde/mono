import { useContext } from "react";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom"
import { Pathnames } from "./utils/consts";
import { RootStoreContext } from "./stores/StoreContext";

import RootLayout from "./layouts/RootLayout";
import RootError from "./layouts/RootLayout/RootError";
import PreviewsLayout from "./layouts/PreviewsLayout";

import BookPreviewsPage from "./pages/BookPreviewsPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import BookFormPage from "./pages/BookFormPage";

import AuthorPreviewsPage from "./pages/AuthorPreviewsPage";
import AuthorDetailsPage from "./pages/AuthorDetailsPage";
import AuthorFormPage from "./pages/AuthorFormPage";


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
        element: <PreviewsLayout />,
        children: [
          {
            index: true,
            element: <BookPreviewsPage />
          },
          {
            path: Pathnames.authors,
            element: <AuthorPreviewsPage />
          },
        ]
      },
      {
        // Routes below do not share layouts,
        // but they share rendering logic and wrapper components from layouts/[...]Page
        children: [
          {
            path: Pathnames.books,
            children: [
              {
                index: true,
                loader: () => redirect('/')
              },
              {
                path: 'new',
                element: <BookFormPage />
              },
              {
                path: `:${Pathnames.id}`,
                children: [
                  {
                    index: true,
                    element: <BookDetailsPage />,
                  },
                  {
                    path: 'edit',
                    element: <BookFormPage />
                  }
                ]
              },
            ]
          },
          {
            path: Pathnames.authors,
            children: [
              {
                path: 'new',
                element: <AuthorFormPage />
              },
              {
                path: `:${Pathnames.id}`,
                children: [
                  {
                    index: true,
                    element: <AuthorDetailsPage />
                  },
                  {
                    path: 'edit',
                    element: <AuthorFormPage />
                  }
                ]
              },
            ]
          }
        ]
      }
    ]
  }
]
);