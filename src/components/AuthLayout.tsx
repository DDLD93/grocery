import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{
            backgroundImage: `url('/auth-bg.jpg')`,  // Add a high-quality grocery/food image
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-emerald-800/90" />
        <div className="relative z-10 flex flex-col justify-center px-12">
          <div className="mb-12">
            <Link to="/" className="flex items-center">
              <span className="text-white text-4xl font-bold tracking-tight">
                Fresh<span className="text-emerald-300">Market</span>
              </span>
            </Link>
            <p className="mt-6 text-emerald-50 text-xl leading-relaxed max-w-md">
              Fresh groceries delivered to your doorstep. Quality products, competitive prices, and exceptional service.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="flex flex-col text-emerald-50">
                <span className="text-3xl font-bold">10k+</span>
                <span className="text-sm opacity-80">Products</span>
              </div>
              <div className="flex flex-col text-emerald-50">
                <span className="text-3xl font-bold">24/7</span>
                <span className="text-sm opacity-80">Delivery</span>
              </div>
              <div className="flex flex-col text-emerald-50">
                <span className="text-3xl font-bold">98%</span>
                <span className="text-sm opacity-80">Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
} 