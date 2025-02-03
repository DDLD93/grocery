import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { 
  Search,
  MoreVertical,
  Eye,
  Truck,
  XCircle,
  CheckCircle,
  Clock,
  Package
} from 'lucide-react';
import { format } from 'date-fns';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_BADGES: Record<OrderStatus, { color: string; icon: JSX.Element }> = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: <Clock className="w-4 h-4 mr-1" />
  },
  processing: {
    color: 'bg-blue-100 text-blue-800',
    icon: <Package className="w-4 h-4 mr-1" />
  },
  shipped: {
    color: 'bg-purple-100 text-purple-800',
    icon: <Truck className="w-4 h-4 mr-1" />
  },
  delivered: {
    color: 'bg-green-100 text-green-800',
    icon: <CheckCircle className="w-4 h-4 mr-1" />
  },
  cancelled: {
    color: 'bg-red-100 text-red-800',
    icon: <XCircle className="w-4 h-4 mr-1" />
  }
};

export function Orders() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { orders, error } = await api.admin.orders.getAll();
      if (error) throw error;
      return orders;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (variables: { orderId: string; status: OrderStatus }) =>
      api.admin.orders.updateStatus(variables.orderId, variables.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  const filteredOrders = orders?.filter(order => 
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    order.user_profiles.email.toLowerCase().includes(search.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="mt-4 sm:mt-0 relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.id.slice(0, 8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user_profiles.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user_profiles.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGES[order.status as OrderStatus].color}`}>
                      {STATUS_BADGES[order.status as OrderStatus].icon}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{order.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative group inline-block text-left">
                      <button className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      <div className="hidden group-hover:block absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <button
                            onClick={() => {/* Implement view details */}}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            <Eye className="mr-3 h-5 w-5 text-gray-400" />
                            View Details
                          </button>
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <>
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => updateStatusMutation.mutate({
                                    orderId: order.id,
                                    status: 'processing'
                                  })}
                                  className="flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 w-full"
                                >
                                  <Package className="mr-3 h-5 w-5 text-blue-400" />
                                  Mark as Processing
                                </button>
                              )}
                              {order.status === 'processing' && (
                                <button
                                  onClick={() => updateStatusMutation.mutate({
                                    orderId: order.id,
                                    status: 'shipped'
                                  })}
                                  className="flex items-center px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 w-full"
                                >
                                  <Truck className="mr-3 h-5 w-5 text-purple-400" />
                                  Mark as Shipped
                                </button>
                              )}
                              {order.status === 'shipped' && (
                                <button
                                  onClick={() => updateStatusMutation.mutate({
                                    orderId: order.id,
                                    status: 'delivered'
                                  })}
                                  className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50 w-full"
                                >
                                  <CheckCircle className="mr-3 h-5 w-5 text-green-400" />
                                  Mark as Delivered
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to cancel this order?')) {
                                    updateStatusMutation.mutate({
                                      orderId: order.id,
                                      status: 'cancelled'
                                    });
                                  }
                                }}
                                className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full"
                              >
                                <XCircle className="mr-3 h-5 w-5 text-red-400" />
                                Cancel Order
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 