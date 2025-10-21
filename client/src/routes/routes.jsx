import HomePage from '../page/User/HomePage'
import { LoginPage } from '../page/Auth/LoginPage'
import { RegisterPage } from '../page/Auth/RegisterPage'
import { useRoutes } from 'react-router-dom'
import { ViewPostPage } from '@/page/User/ViewPostPage'
import ArticleManagementPage from '@/page/Admin/ArticlePage/ArticleManagementPage'
import { CreateArticlePage } from '@/page/Admin/ArticlePage/CreateArticlePage'
import CreateCategoryPage from '@/page/Admin/CategoryPage/CreateCategoryPage'
import CategoryManagementPage from '@/page/Admin/CategoryPage/CategoryManagementPage'
import { ProfilePage } from '@/page/User/ProfilePage'
import ProtectedRoute from '@/components/ProtectedRoute'
import ResetpasswordPage from '@/page/User/ResetpasswordPage'
import { EditArticlePage } from '@/page/Admin/ArticlePage/EditArticlePage'
import EditCategoryPage from '@/page/Admin/CategoryPage/EditCategoryPage'
import AdminProfilePage from '@/page/Admin/ProfilePage/AdminProfilePage'
import AdminResetPasswordPage from '@/page/Admin/AdminResetPasswordPage/AdminResetPasswordPage'
import NotiPage from '@/page/Admin/NotificationPage/NotiPage'
import AIChatModal from '@/components/AIChatModal'
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
          <CreateCategoryPage />
        </ProtectedRoute>
      )
    },
    { 
      path: '/admin/category-management/edit/:id', 
      element: (
        <ProtectedRoute roles={["admin"]}>
          <EditCategoryPage  />
        </ProtectedRoute>
      )
    },
    { 
      path: '/admin/profile', 
      element: (
        <ProtectedRoute roles={["admin"]}>
          <AdminProfilePage  />
        </ProtectedRoute>
      )
    },
    { 
      path: '/admin/reset-password', 
      element: (
        <ProtectedRoute roles={["admin"]}>
          <AdminResetPasswordPage />
        </ProtectedRoute>
      )
    },
    { 
      path: '/admin/notification', 
      element: (
        <ProtectedRoute roles={["admin"]}>
          <NotiPage />
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
