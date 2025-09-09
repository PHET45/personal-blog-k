import HomePage from '../page/User/HomePage'
import { useRoutes } from 'react-router-dom'

export default function AppRoutes() {
  return useRoutes([
    { path: '/', element: <HomePage /> },
    //   { path: "/login", element: <Login /> },
    //   { path: "/register", element: <Register /> },
    //   { path: "/article", element: <Article /> },
    //   { path: "/article/:id", element: <ArticleDetail /> },

    // admin
    //   {
    //     element: <RoleRoute roles={["admin"]} />,
    //     children: [
    //       { path: "/admin", element: <AdminArticle /> },
    // { path: "/admin/users", element: <AdminUsers /> },
    // { path: "/admin/settings", element: <AdminSettings /> },
    //     ],
    //   },
  ])
}
