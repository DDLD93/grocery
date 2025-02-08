import { useQuery } from '@tanstack/react-query';
import { Search, Apple, Leaf } from 'lucide-react';
import { useState } from 'react';
import { api } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import { CartPreview } from '../components/CartPreview';

const CATEGORIES = [
  'All',
  'Recommended',
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Meat & Fish',
  'Bakery',
  'Beverages',
  'Snacks',
  'Household'
];

export function Products() {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory],
    queryFn: async () => {
      if (selectedCategory === 'Recommended') {
        const userId = await api.auth.getCurrentUser(); // Replace with real user ID
        const recommendations = await api.products.getRecommendations(userId.user?.id || '');
        return { products: recommendations.recommendations };
      }

      let products = searchQuery 
        ? await api.products.search(searchQuery)
        : await api.products.getAll();

      if (selectedCategory !== 'All' && products.products) {
        products.products = products.products.filter(
          product => product.category === selectedCategory
        );
      }

      return products;
    },
  });

  const handleSearch = () => {
    setSearchQuery(inputText);
  };

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
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-green-500 shadow-lg"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              onClick={handleSearch}
              className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-md transition hover:bg-green-500"
            >
              Search
            </button>
          </div>
        </div>
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
          {data?.products?.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No products found for "{searchQuery}" in {selectedCategory}
            </div>
          ) : (
            data?.products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      )}

      <CartPreview />
    </div>
  );
}