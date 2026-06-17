import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const getStorage = () => (localStorage.getItem('token') ? localStorage : sessionStorage);

  const saveAuth = (token, userData, remember = false) => {
    const storage = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    other.removeItem('token');
    other.removeItem('user');
    storage.setItem('token', token);
    storage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = useCallback((userData) => {
    setUser(userData);
    const storage = getStorage();
    storage.setItem('user', JSON.stringify(userData));
  }, []);

  const fetchFullProfile = async () => {
    const { data } = await userAPI.getProfile();
    updateUser(data);
    return data;
  };

  const login = async (email, password, remember = false) => {
    const { data } = await authAPI.login({ email, password });
    saveAuth(data.token, data.user, remember);
    await fetchFullProfile();
    return data;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    saveAuth(data.token, data.user, true);
    await fetchFullProfile();
    return data;
  };

  const logout = () => clearAuth();

  const refreshProfile = useCallback(async () => {
    try {
      return await fetchFullProfile();
    } catch {
      clearAuth();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      userAPI.getProfile()
        .then(({ data }) => updateUser(data))
        .catch(() => clearAuth())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [updateUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshProfile,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
