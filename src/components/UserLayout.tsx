import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  User,
  ShoppingCart, 
  Package,
  ClipboardList,
  LogOut,
  TrendingUp 
} from 'lucide-react';
import { api } from '../lib/api';

export function UserLayout() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await api.auth.logout();
      navigate('/auth/login');
    } catch (error) {
      alert('Logout failed',error.message);
      console.error('Logout failed:', error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-emerald-600">
              SMARTGROCERY NAIJA
              </Link>
              <nav className="hidden md:ml-8 md:flex md:space-x-4">
                <Link
                  to="/products"
                  className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Package className="w-5 h-5 inline-block mr-1" />
                  Products
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <ClipboardList className="w-5 h-5 inline-block mr-1" />
                  Orders
                </Link>
                <Link
                  to="/insights"
                  className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <TrendingUp className="w-5 h-5 inline-block mr-1" />
                  Insights
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/cart"
                className="text-gray-700 hover:text-emerald-600 p-2 rounded-md"
              >
                <ShoppingCart className="w-6 h-6" />
              </Link>
              <div className="relative ml-3">
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-emerald-600 p-2 rounded-md"
                  >
                    <User className="w-6 h-6" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-emerald-600 p-2 rounded-md"
                  >
                    <LogOut className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
} 