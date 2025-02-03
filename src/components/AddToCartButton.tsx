import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '../lib/store';
import { Product } from '../types';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const { items, addItem } = useCartStore();
  const isInCart = items.some(item => item.id === product.id);

  return (
    <button
      onClick={() => !isInCart && addItem(product)}
      disabled={isInCart}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        isInCart 
          ? 'bg-emerald-100 text-emerald-800 cursor-default'
          : 'text-white bg-emerald-600 hover:bg-emerald-700'
      } ${className}`}
    >
      {isInCart ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          In Cart
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </>
      )}
    </button>
  );
} 