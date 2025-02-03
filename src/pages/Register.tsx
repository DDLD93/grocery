import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin,
  AlertCircle,
  Loader2,
  Apple,
  Leaf,
  ArrowLeft
} from 'lucide-react';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  address: string;
  dietary_preferences?: string;
}

export function Register() {
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await signUp(data);
      if (result.error) throw result.error;
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Link>

        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Apple className="w-10 h-10 text-green-600" />
            <Leaf className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="text-gray-600 mt-2">Join us for fresh groceries delivered to your door</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="John Doe"
                  />
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="you@example.com"
                  />
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    {...register('phone_number', { required: 'Phone number is required' })}
                    type="tel"
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="+234..."
                  />
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type="password"
                    className="pl-10 w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="••••••••"
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <div className="relative">
                <textarea
                  {...register('address', { required: 'Address is required' })}
                  rows={3}
                  className="pl-10 w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  placeholder="Enter your delivery address..."
                />
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 