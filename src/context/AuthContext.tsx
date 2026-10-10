import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/index.ts';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  language: 'en' | 'ta';
  setLanguage: (lang: 'en' | 'ta') => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginAsDemoFarmer: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('agrisense_token'));
  const [language, setLanguageState] = useState<'en' | 'ta'>(() => {
    return (localStorage.getItem('agrisense_lang') as 'en' | 'ta') || 'en';
  });
  const [loading, setLoading] = useState(true);

  const setLanguage = (lang: 'en' | 'ta') => {
    setLanguageState(lang);
    localStorage.setItem('agrisense_lang', lang);
  };

  useEffect(() => {
    async function checkSession() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          if (data.user.language) {
            setLanguage(data.user.language);
          }
        } else {
          setToken(null);
          localStorage.removeItem('agrisense_token');
        }
      } catch (e) {
        console.error('Session verify failed:', e);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [token]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('agrisense_token', data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const register = async (regData: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('agrisense_token', data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agrisense_token');
  };

  const loginAsDemoFarmer = async () => {
    await login('rajesh.kumar@agrisense.farm', 'password123');
  };

  const loginAsDemoAdmin = async () => {
    await login('admin@agrisense.farm', 'admin123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        language,
        setLanguage,
        login,
        register,
        logout,
        loginAsDemoFarmer,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
