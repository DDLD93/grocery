import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/api';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../../components/AuthLayout';

interface LoginForm {
  email: string;
  password: string;
}

export function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const onSubmit = async (data: LoginForm) => {
    try {
      const { user, error } = await api.auth.login(data);
      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout 
      title="Welcome to FreshMarket"
      subtitle="Sign in to your account to start shopping"
    >
      <div className="mt-8">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
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
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500" />
                </div>
                <input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  className="block w-full pl-10 pr-3 py-3 text-sm border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors duration-200"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link 
                to="/auth/forgot-password" 
                className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
              >
                Forgot password?
              </Link>
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
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>

            <Link
              to="/auth/register"
              className="relative w-full flex justify-center py-3 px-4 border border-emerald-600 rounded-xl text-sm font-medium text-emerald-700 bg-transparent hover:bg-emerald-50 transition-colors duration-200"
            >
              Create new account
            </Link>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <img src="/apple.svg" alt="Apple" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}