import { createBrowserRouter } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout/PageLayout';
import { HomePage } from '../features/storefront/home/HomePage';
import { ProductsPage } from '../features/storefront/products/ProductsPage';
import { CategoriesPage } from '../features/storefront/categories/CategoriesPage';
import { CategoryPage } from '../features/storefront/categories/CategoryPage';
import { CheckoutPage } from '../features/storefront/checkout/CheckoutPage';
import { AboutPage } from '../features/storefront/about/AboutPage';
import { LoginPage } from '../features/auth/login/LoginPage';
import { ErrorElement } from '../components/layout/ErrorElement/ErrorElement';
import { ProductDetailsPage } from '../features/storefront/products/ProductDetailsPage';
import { GenericInfoPage } from '../features/storefront/info/GenericInfoPage';
import { FAQPage } from '../features/storefront/info/FAQPage';
import { PrivacyPage } from '../features/storefront/legal/PrivacyPage';
import { TermsPage } from '../features/storefront/legal/TermsPage';
import { DisclaimerPage } from '../features/storefront/legal/DisclaimerPage';
import { ShippingPage } from '../features/storefront/legal/ShippingPage';
import { RegisterPage } from '../features/auth/register/RegisterPage';
import { ConfirmEmailPage } from '../features/auth/confirm-email/ConfirmEmailPage';
import { ForgotPasswordPage } from '../features/auth/forgot-password/ForgotPasswordPage';
import { UpdatePasswordPage } from '../features/auth/forgot-password/UpdatePasswordPage';
import { ContactPage } from '../features/storefront/contact/ContactPage';
import { ProfilePage } from '../features/storefront/profile/ProfilePage';
import { MyOrdersPage } from '../features/storefront/orders/MyOrdersPage';

// Admin Imports
import { AdminGuard } from '../components/layout/AdminGuard/AdminGuard';
import { AdminLayout } from '../components/layout/AdminLayout/AdminLayout';
import { AdminDashboard } from '../features/admin/dashboard/AdminDashboard';
import { AdminProductsPage } from '../features/admin/products/AdminProductsPage';
import { AdminOrdersPage } from '../features/admin/orders/AdminOrdersPage';
import { AdminUsersPage } from '../features/admin/users/AdminUsersPage';
import { AdminSettingsPage } from '../features/admin/settings/AdminSettingsPage';
import { AdminPagesPage } from '../features/admin/pages/AdminPagesPage';
import { AdminCategoriesPage } from '../features/admin/categories/AdminCategoriesPage';
import { AdminReviewsPage } from '../features/admin/reviews/AdminReviewsPage';
import { AdminMessagesPage } from '../features/admin/messages/AdminMessagesPage';
import { DynamicPage } from '../features/storefront/cms/DynamicPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'products/:productSlug',
        element: <ProductDetailsPage />,
      },
      {
        path: 'p/:pageSlug',
        element: <DynamicPage />,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'categories/:categoryId',
        element: <CategoryPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'confirm-email',
        element: <ConfirmEmailPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'update-password',
        element: <UpdatePasswordPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'faq',
        element: <FAQPage />,
      },
      {
        path: 'shipping',
        element: <ShippingPage />,
      },
      {
        path: 'return',
        element: <GenericInfoPage title="Return and Exchange Policy" />,
      },
      {
        path: 'privacy',
        element: <PrivacyPage />,
      },
      {
        path: 'terms',
        element: <TermsPage />,
      },
      {
        path: 'disclaimer',
        element: <DisclaimerPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'orders',
        element: <MyOrdersPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminGuard />,
    errorElement: <ErrorElement />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: 'products',
            element: <AdminProductsPage />,
          },
          {
            path: 'pages',
            element: <AdminPagesPage />,
          },
          {
            path: 'page',
            element: <AdminPagesPage />,
          },
          {
            path: 'categories',
            element: <AdminCategoriesPage />,
          },
          {
            path: 'orders',
            element: <AdminOrdersPage />,
          },
          {
            path: 'users',
            element: <AdminUsersPage />,
          },
          {
            path: 'reviews',
            element: <AdminReviewsPage />,
          },
          {
            path: 'messages',
            element: <AdminMessagesPage />,
          },
          {
            path: 'settings',
            element: <AdminSettingsPage />,
          },
        ]
      }
    ]
  }
]);
