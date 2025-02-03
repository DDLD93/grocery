import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, Star } from 'lucide-react';

export function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Smart Grocery Shopping, Personalized for You
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover products you'll love with our AI-powered recommendations
        </p>
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Start Shopping
        </Link>
      </section>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <TrendingUp className="w-12 h-12 text-emerald-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Smart Recommendations</h3>
          <p className="text-gray-600">
            Get personalized product suggestions based on your preferences and shopping history.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <ShoppingBag className="w-12 h-12 text-emerald-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Wide Selection</h3>
          <p className="text-gray-600">
            Browse through our extensive collection of quality groceries and household items.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Star className="w-12 h-12 text-emerald-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Quality Assured</h3>
          <p className="text-gray-600">
            All products are carefully selected to ensure the highest quality standards.
          </p>
        </div>
      </div>
    </div>
  );
}