import { Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '../lib/store';
import { useNavigate } from 'react-router-dom';
import { AIChatBox } from '../components/cart/AIChatBox';

export function Cart() {
  const { items, total, removeItem, updateQuantity } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded hover:bg-emerald-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        
        <div className="bg-white rounded-lg shadow-sm">
          {items.map((item) => (
            <div key={item.id} className="flex items-center p-4 border-b last:border-b-0">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1 ml-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">₦{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="rounded border p-1"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
          <div>
            <p className="text-gray-600">Total</p>
            <p className="text-2xl font-bold">₦{total.toFixed(2)}</p>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      {/* AI Chat Interface */}
      <div className="lg:col-span-1">
        <AIChatBox />
      </div>
    </div>
  );
}