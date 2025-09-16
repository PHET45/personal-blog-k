import HomePage from '../page/User/HomePage'
import { LoginPage } from '../page/Auth/LoginPage'
import { RegisterPage } from '../page/Auth/RegisterPage'
import { useRoutes } from 'react-router-dom'
import { ViewPostPage } from '@/page/User/ViewPostPage'
import ArticleManagementPage from '@/page/Admin/ArticlePage/ArticleManagementPage'
import { CreateArticlePage } from '@/page/Admin/ArticlePage/CreateArticlePage'
import CategoryManagementPage from '@/page/Admin/CategoryPage/CategoryManagementPage'

export default function AppRoutes() {
  return useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/post/:postid', element:<ViewPostPage />},
    { path: '/admin/article-management', element: <ArticleManagementPage /> },
    { path: '/admin/create-article', element: <CreateArticlePage /> },
    { path: '/admin/category-management', element: <CategoryManagementPage /> },
  ])
}
