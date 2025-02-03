import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { error, ...stats } = await api.admin.getStats();
      if (error) throw error;
      return stats;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="mt-4 sm:mt-0">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
            Last 30 Days
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats?.users}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="/admin/users" className="font-medium text-emerald-700 hover:text-emerald-900">
                View all users
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <Package className="w-12 h-12 text-emerald-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Products</p>
              <p className="text-2xl font-semibold">{stats?.products}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <ShoppingCart className="w-12 h-12 text-emerald-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Orders</p>
              <p className="text-2xl font-semibold">{stats?.orders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <TrendingUp className="w-12 h-12 text-emerald-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-semibold">₦{stats?.revenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}