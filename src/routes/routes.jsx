import HomePage from '../page/User/HomePage'
import { LoginPage } from '../page/Auth/LoginPage'
import { RegisterPage } from '../page/Auth/RegisterPage'
import { useRoutes } from 'react-router-dom'
import { ViewPostPage } from '@/page/User/ViewPostPage'

export default function AppRoutes() {
  return useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/post/:postid', element:<ViewPostPage />}
  ])
}
