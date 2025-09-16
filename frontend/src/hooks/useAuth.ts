import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, clearAuth, isAuthenticated } from '@/lib/auth';
import { User } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { user: authUser } = getAuth();
    setUser(authUser);
    setLoading(false);
  }, []);

  const logout = () => {
    clearAuth();
    setUser(null);
    router.push('/login');
  };

  const requireAuth = () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return false;
    }
    return true;
  };

  const requireAdmin = () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return false;
    }
    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return false;
    }
    return true;
  };

  return {
    user,
    loading,
    logout,
    requireAuth,
    requireAdmin,
    isAuthenticated: isAuthenticated(),
    isAdmin: user?.role === 'admin',
  };
};