import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Shield, Truck, Package, ArrowLeft, Leaf, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';
import { AddToCartButton } from '../components/AddToCartButton';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: <Leaf className="w-5 h-5 text-green-600" />,
    title: "Fresh Guarantee",
    description: "100% fresh products"
  },
  {
    icon: <Truck className="w-5 h-5 text-green-600" />,
    title: "Same Day Delivery",
    description: "Free for orders over ₦5000"
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-green-600" />,
    title: "Quality Assured",
    description: "Carefully selected products"
  }
];

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.mockData.getProductById(id!),
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-96 bg-gray-200 rounded-xl"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!data?.product) return <div className="text-center py-12">Product not found</div>;

  return (
    <div className="space-y-8">
      <Link
        to="/products"
        className="inline-flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Shopping
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <img
              src={data.product.image_url}
              alt={data.product.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
            {data.product.is_organic && (
              <div className="mt-4 flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
                <Leaf className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Organic Product</span>
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">{data.product.name}</h1>
              {data.product.in_stock ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  In Stock
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-6">{data.product.description}</p>

            <div className="flex items-center justify-between mb-6">
              <div className="text-3xl font-bold text-green-600">
                ₦{data.product.price.toFixed(2)}
                <span className="text-sm text-gray-500 font-normal">/kg</span>
              </div>
              <div className="text-sm text-gray-500">
                Minimum: 0.5kg
              </div>
            </div>

            {/* Quantity Selector could go here */}

            <AddToCartButton 
              product={data.product} 
              className="w-full py-4 text-lg mb-6"
            />

            {/* Nutritional Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2">Nutritional Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Calories:</span>
                  <span className="float-right font-medium">120kcal</span>
                </div>
                <div>
                  <span className="text-gray-600">Protein:</span>
                  <span className="float-right font-medium">4g</span>
                </div>
                {/* Add more nutritional info as needed */}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              {FEATURES.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-green-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Tips */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Storage Tips</h2>
            <p className="text-gray-600">Store in a cool, dry place. Best consumed within 3-4 days of purchase.</p>
          </div>
        </div>
      </div>
    </div>
  );
}