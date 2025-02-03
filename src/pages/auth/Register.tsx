import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/api';
import { Mail, Lock, User, Phone, MapPin, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../../components/AuthLayout';

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone_number: string;
  address: string;
  dietary_preferences: string[];
}

const dietaryOptions = [
  'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free',
  'Nut-free', 'Halal', 'Kosher'
];

export function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { user, error } = await api.auth.register(data);
      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout 
      title="Join FreshMarket"
      subtitle="Create an account to start shopping fresh groceries"
    >
      <div className="mt-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {/* Personal Information Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500" />
                  </div>
                  <input
                    {...register('name', { required: 'Full name is required' })}
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 text-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors duration-200"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500" />
                  </div>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    type="email"
                    className="block w-full pl-10 pr-3 py-3 text-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors duration-200"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500" />
                  </div>
                  <input
                    {...register('phone_number', { required: 'Phone number is required' })}
                    type="tel"
                    className="block w-full pl-10 pr-3 py-3 text-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors duration-200"
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.phone_number && (
                    <p className="mt-2 text-sm text-red-600">{errors.phone_number.message}</p>
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                <div className="mt-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500" />
                  </div>
                  <input
                    {...register('address', { required: 'Delivery address is required' })}
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 text-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors duration-200"
                    placeholder="123 Main St, City, State"
                  />
                  {errors.address && (
                    <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500" />
                  </div>
                  <input
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                      }
                    })}
                    type="password"
                    className="block w-full pl-10 pr-3 py-3 text-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors duration-200"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="mt-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500" />
                  </div>
                  <input
                    {...register('confirmPassword', { required: 'Please confirm your password' })}
                    type="password"
                    className="block w-full pl-10 pr-3 py-3 text-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors duration-200"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Dietary Preferences</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {dietaryOptions.map((option) => (
                <div key={option} className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      {...register('dietary_preferences')}
                      value={option}
                      className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded transition-colors duration-200"
                    />
                    <label className="ml-2 text-sm text-gray-600">
                      {option}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>

            <Link
              to="/auth/login"
              className="relative w-full flex justify-center py-3 px-4 border border-emerald-600 rounded-xl text-sm font-medium text-emerald-700 bg-transparent hover:bg-emerald-50 transition-colors duration-200"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}