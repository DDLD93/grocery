import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Product } from '../../types';
import { 
  MoreVertical, 
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  Tag,
  Archive,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { ProductModal } from '../../components/admin/ProductModal';

export function Products() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { products, error } = await api.products.getAll();
      if (error) throw error;
      return products;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => api.admin.products.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: (variables: { id: string; is_available: boolean }) => 
      api.admin.products.update(variables.id, { is_available: variables.is_available }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.description.toLowerCase().includes(search.toLowerCase())
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
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts?.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₦{product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mr-2 ${
                        product.stock_quantity > 10 
                          ? 'bg-green-400' 
                          : product.stock_quantity > 0 
                            ? 'bg-yellow-400' 
                            : 'bg-red-400'
                      }`} />
                      <span className="text-sm text-gray-900">{product.stock_quantity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleAvailabilityMutation.mutate({
                        id: product.id,
                        is_available: !product.is_available
                      })}
                      className={`inline-flex items-center px-2.5 py-1.5 rounded text-xs font-medium ${
                        product.is_available
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {product.is_available ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      {product.is_available ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative group inline-block text-left">
                      <button className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      <div className="hidden group-hover:block absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsModalOpen(true);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            <Edit className="mr-3 h-5 w-5 text-gray-400" />
                            Edit Product
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this product?')) {
                                deleteMutation.mutate(product.id);
                              }
                            }}
                            className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full"
                          >
                            <Trash2 className="mr-3 h-5 w-5 text-red-400" />
                            Delete Product
                          </button>
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

      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}