import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Home } from './pages/Home'
import { CreatePoint } from './pages/CreatePoint'

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/create-point", element: <CreatePoint /> },
])

export function Routes() {
	return (
		<RouterProvider router={router} />
	)
}
