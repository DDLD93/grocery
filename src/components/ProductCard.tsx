import { Link } from 'react-router-dom';
import { Product } from '../types';
import { AddToCartButton } from './AddToCartButton';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">₦{product.price.toFixed(2)}</span>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}