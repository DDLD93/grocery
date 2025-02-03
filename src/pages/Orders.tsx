import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import { 
  Clock, 
  Package, 
  Truck, 
  CheckCircle2, 
  Calendar, 
  MapPin,
  Receipt,
  AlertCircle,
  ChevronRight,
  Filter
} from 'lucide-react';

const STATUS_STYLES = {
  pending: {
    icon: <Clock className="w-4 h-4" />,
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Order Received'
  },
  processing: {
    icon: <Package className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-800',
    label: 'Preparing Order'
  },
  shipped: {
    icon: <Truck className="w-4 h-4" />,
    color: 'bg-purple-100 text-purple-800',
    label: 'Out for Delivery'
  },
  completed: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'bg-green-100 text-green-800',
    label: 'Delivered'
  }
};

export function Orders() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) throw new Error('Not authenticated');
      return api.mockData.getOrders();
    },
  });

  if (data?.error) {
    return (
      <div className="text-center py-12 text-red-600">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        Error fetching orders: {data.error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl p-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 -mx-4 -mt-4 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Order History</h1>
              <p className="text-emerald-100">Track and manage your orders</p>
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filter Orders
            </button>
          </div>
        </div>
      </div>

      {data?.orders?.length === 0 ? (
        <div className="text-center py-12">
          <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No orders yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.orders?.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-emerald-100 text-sm">Order ID</p>
                    <p className="font-medium">#{order.id.slice(0, 8)}</p>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLES[order.status]?.color}`}>
                    {STATUS_STYLES[order.status]?.icon}
                    <span>{STATUS_STYLES[order.status]?.label}</span>
                  </div>
                </div>
              </div>

              {/* Order Preview */}
              <div className="p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Order Items Preview */}
                <div className="flex items-center space-x-2 mb-4">
                  {order.order_items?.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="relative">
                      <img
                        src={item.products.image_url}
                        alt={item.products.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                  ))}
                  {order.order_items?.length > 3 && (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-sm text-gray-600">+{order.order_items.length - 3}</span>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">Delivery Address</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-bold text-green-600">₦{order.total_amount.toFixed(2)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}