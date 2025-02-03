import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserLayout } from './components/UserLayout';
import { AdminLayout } from './components/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

// User pages
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';

// Auth pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Admin pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { Users } from './pages/admin/Users';
import { Products as AdminProducts } from './pages/admin/Products';
import { Orders as AdminOrders } from './pages/admin/Orders';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Products />},
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetails /> },
      { path: 'cart', element: <Cart /> },
      { path: 'profile', element: <Profile /> },
      { path: 'orders', element: <Orders /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { path: '', element: <AdminDashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'orders', element: <AdminOrders /> },
    ],
  },
  {
    path: '/auth',
    children: [
      { path: 'login', element: <Login />, errorElement: <ErrorBoundary /> },
      { path: 'register', element: <Register />, errorElement: <ErrorBoundary /> },
    ],
  },
  { path: '*', element: <ErrorBoundary /> },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;