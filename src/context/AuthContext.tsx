import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types/index.ts';
import { apiService } from '../services/api.ts';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  adminKey: string | null;
  loginUser: (email: string, name: string, phone: string, whatsapp?: string) => void;
  logoutUser: () => void;
  adminLogin: (key: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  updateUserAddress: (address: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'leone_customer_user_v1';
const ADMIN_STORAGE_KEY = 'leone_admin_key_v1';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [adminKey, setAdminKey] = useState<string | null>(() => {
    return localStorage.getItem(ADMIN_STORAGE_KEY) || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (adminKey) {
      localStorage.setItem(ADMIN_STORAGE_KEY, adminKey);
    } else {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  }, [adminKey]);

  const loginUser = (email: string, name: string, phone: string, whatsapp?: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName: name,
      phone,
      whatsapp: whatsapp || phone,
      addresses: [],
      wishlist: [],
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
  };

  const logoutUser = () => {
    setUser(null);
  };

  const adminLogin = async (key: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await apiService.adminLogin(key);
      if (res.success && res.token) {
        setAdminKey(res.token);
        return { success: true };
      } else {
        return { success: false, error: res.error || 'Invalid administrator password' };
      }
    } catch (e) {
      return { success: false, error: 'Connection error during authentication. Please try again.' };
    }
  };

  const adminLogout = () => {
    setAdminKey(null);
  };

  const updateUserAddress = (address: any) => {
    if (!user) return;
    setUser({
      ...user,
      addresses: [...user.addresses, address]
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: !!adminKey,
        adminKey,
        loginUser,
        logoutUser,
        adminLogin,
        adminLogout,
        updateUserAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
