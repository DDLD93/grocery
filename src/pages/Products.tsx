import { useQuery } from '@tanstack/react-query';
import { Search, Filter, ChevronDown, Apple, Leaf, Sparkles, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { api } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import { CartPreview } from '../components/CartPreview';

const CATEGORIES = [
  'All',
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Meat & Fish',
  'Bakery',
  'Beverages',
  'Snacks',
  'Household'
];

const RECOMMENDATIONS = [
  {
    title: "Popular Right Now",
    description: "Trending items in your area",
    color: "from-orange-500 to-pink-500"
  },
  {
    title: "Fresh Arrivals",
    description: "New products this week",
    color: "from-emerald-500 to-teal-500"
  },
  {
    title: "Season's Best",
    description: "Top seasonal products",
    color: "from-blue-500 to-indigo-500"
  }
];

export function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['products', searchQuery],
    queryFn: () => searchQuery ? api.products.search(searchQuery) : api.mockData.getProducts(),
  });

  if (data?.error) {
    return <div className="text-center py-12">Error fetching products: {data.error.message}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 -mx-4 -mt-4 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Apple className="w-8 h-8 text-white" />
            <Leaf className="w-6 h-6 text-green-200" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Fresh Groceries Delivered
          </h1>
          <p className="text-green-100 mb-6">Quality products from farm to your doorstep</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for fruits, vegetables, etc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-green-500 shadow-lg"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="relative">
              <button className="inline-flex items-center px-4 py-3 bg-white rounded-xl shadow-lg text-gray-700 hover:bg-gray-50">
                <Filter className="w-5 h-5 mr-2" />
                Dietary Filters
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RECOMMENDATIONS.map((rec, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${rec.color} p-4 rounded-xl text-white cursor-pointer hover:shadow-lg transition-shadow`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold mb-1">{rec.title}</h3>
                <p className="text-sm text-white/80">{rec.description}</p>
              </div>
              <Sparkles className="w-5 h-5 text-white/80" />
            </div>
            <button className="mt-4 inline-flex items-center text-sm bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-green-100 text-green-800 font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-xl aspect-square mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <CartPreview />
    </div>
  );
}