import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { useAuth } from '../lib/auth';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart,
  LogOut 
} from 'lucide-react';
import { api } from '../lib/api';

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <h1 className="text-xl font-bold text-emerald-600">Admin Dashboard</h1>
            <div className="mt-2 text-sm text-gray-600">
              {/* Welcome, {user?.email} */}
            </div>
          </div>
          <nav className="mt-4">
            <Link
              to="/admin"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <BarChart className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <Users className="w-5 h-5 mr-2" />
              Users
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <Package className="w-5 h-5 mr-2" />
              Products
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Orders
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="flex justify-between items-center px-4 py-4">
              <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            </div>
          </header>
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}