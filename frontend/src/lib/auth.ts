import Cookies from 'js-cookie';
import { User } from '@/types';

export const setAuth = (token: string, user: User) => {
  Cookies.set('token', token, { expires: 7 });
  Cookies.set('user', JSON.stringify(user), { expires: 7 });
};

export const getAuth = (): { token: string | undefined; user: User | null } => {
  const token = Cookies.get('token');
  const userStr = Cookies.get('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
};

export const clearAuth = () => {
  Cookies.remove('token');
  Cookies.remove('user');
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get('token');
};

export const isAdmin = (): boolean => {
  const { user } = getAuth();
  return user?.role === 'admin';
};