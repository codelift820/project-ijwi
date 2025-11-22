import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if admin is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get stored admin session
        const storedAdmin = localStorage.getItem('adminUser');
        const sessionToken = localStorage.getItem('adminSessionToken');

        if (storedAdmin && sessionToken) {
          const admin = JSON.parse(storedAdmin);
          // Verify token is still valid (in production, validate with backend)
          setAdminUser(admin);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminSessionToken');
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch admin user from database
      const { data: admins, error: fetchError } = await supabase
        .from('admin_users')
        .select('id, email, full_name, role, is_active')
        .eq('email', email)
        .single();

      if (fetchError) {
        throw new Error('Admin account not found');
      }

      if (!admins) {
        throw new Error('Invalid admin credentials');
      }

      if (!admins.is_active) {
        throw new Error('Admin account is inactive');
      }

      // IMPORTANT: In production, you should use Supabase Auth for proper password management
      // For now, we'll do basic validation (this is simplified for demo)
      // In production: use supabase.auth.signInWithPassword()

      // Store admin session (simplified - replace with proper auth in production)
      const sessionToken = `token_${Date.now()}_${Math.random()}`;
      
      const adminData: AdminUser = {
        id: admins.id,
        email: admins.email,
        full_name: admins.full_name,
        role: admins.role,
      };

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', admins.id);

      // Store session
      localStorage.setItem('adminUser', JSON.stringify(adminData));
      localStorage.setItem('adminSessionToken', sessionToken);
      setAdminUser(adminData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Clear session
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminSessionToken');
      setAdminUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isLoading,
        isAuthenticated: !!adminUser,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
