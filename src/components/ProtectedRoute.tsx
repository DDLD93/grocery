import { Navigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { User } from '../types';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const { user, error } = await api.auth.getCurrentUser();
      if (error) {
        throw error;
        return;

      }
      setUser(user);
      setIsAdmin(user?.role === 'admin');
      setLoading(false);
    };


    fetchUser();
  }, []);



  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    </div>
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // if (requireAdmin && !isAdmin) {
  //   return <Navigate to="/" replace />;
  // }

  return <>{children}</>;
} 