import HomePage from '../page/User/HomePage'
import { LoginPage } from '../page/Auth/LoginPage'
import { RegisterPage } from '../page/Auth/RegisterPage'
import { useRoutes } from 'react-router-dom'
import { ViewPostPage } from '@/page/User/ViewPostPage'
import ArticleManagementPage from '@/page/Admin/ArticlePage/ArticleManagementPage'
import { CreateArticlePage } from '@/page/Admin/ArticlePage/CreateArticlePage'
import CreateCategory from '@/components/Admin/CategoryManagement/CreateCategory'
import CategoryManagementPage from '@/page/Admin/CategoryPage/CategoryManagementPage'
import { ProfilePage } from '@/page/User/ProfilePage'
import ProtectedRoute from '@/components/ProtectedRoute'
import ResetpasswordPage from '@/page/User/ResetpasswordPage'
import { EditArticlePage } from '@/page/Admin/ArticlePage/EditArticlePage'

export default function AppRoutes() {
  return useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/post/:postid', element: <ViewPostPage /> },

    // 🔒 Protected Routes
    { 
      path: '/admin/article-management', 
      element: (
        <ProtectedRoute roles={["admin"]}>
          <ArticleManagementPage />
        </ProtectedRoute>
      )
    },
    { 
      path: '/admin/article-management/create-article', 
      element: (
        <ProtectedRoute roles={["admin"]}>
          <CreateArticlePage />
        </ProtectedRoute>
      )
    },
   
    { 
      path: '/admin/article-management/edit/:id', 
      element: (
        <ProtectedRoute roles={["admin"]}>
          <EditArticlePage />
        </ProtectedRoute>
      )
    },
    { 
      path: '/admin/category-management', 
      element: (
        <ProtectedRoute roles={["admin"]}>
          <CategoryManagementPage />
        </ProtectedRoute>
      )
    },
    { 
      path: '/admin/category-management/create-category', 
      element: (
        <ProtectedRoute roles={["admin"]}>
          <CreateCategory />
        </ProtectedRoute>
      )
    },
    {
      path: '/profile',
      element:(
        <ProtectedRoute roles={["authenticated","admin"]}>
          <ProfilePage/>
        </ProtectedRoute>
      )
    },
    {
      path: '/reset-password',
      element:(
        <ProtectedRoute roles={["authenticated", "admin"]}>
          <ResetpasswordPage/>
        </ProtectedRoute>
      )
    },
  ])
}
