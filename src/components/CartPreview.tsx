import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X } from 'lucide-react';
import { useCartStore } from '../lib/store';
import { useState, useEffect, useRef } from 'react';

export function CartPreview() {
  const { items, total } = useCartStore();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  // Show preview when items are added
  useEffect(() => {
    if (items.length > 0) {
      setShow(true);
      timerRef.current = setTimeout(() => setShow(false), 3000);
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [items.length]);

  const handleFloatingButtonClick = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setShow(prev => !prev);
  };

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={handleFloatingButtonClick}
        className="fixed bottom-4 right-4 p-4 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors z-50 flex items-center space-x-2"
      >
        <ShoppingCart className="w-6 h-6" />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {/* Cart Preview Panel */}
      {show && items.length > 0 && (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-slide-up">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-emerald-600">
                <ShoppingCart className="w-5 h-5 mr-2" />
                <span className="font-medium">Cart Summary</span>
              </div>
              <button
                onClick={() => setShow(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × ₦{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">₦{total.toFixed(2)}</span>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/cart')}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm font-medium transition-colors"
                >
                  View Cart
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm font-medium transition-colors"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 