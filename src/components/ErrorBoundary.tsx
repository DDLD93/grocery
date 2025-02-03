import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {error.status === 404 ? '404 - Page Not Found' : 'Oops! Something went wrong'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error.status === 404
              ? "The page you're looking for doesn't exist or has been moved."
              : 'We encountered an unexpected error. Please try again later.'}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Unexpected Error</h1>
        <p className="text-gray-600 mb-6">An unexpected error occurred. Please try again later.</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
        >
          Go Home
        </button>
      </div>
    </div>
  );
} 