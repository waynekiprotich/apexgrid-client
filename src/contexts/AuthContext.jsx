import React, { createContext, useState, useEffect, useCallback, useContext, useRef } from 'react';
import api, { setupInterceptors } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const tokenRef = useRef(null);

  // Keep the ref in sync so interceptors always see the latest token
  // without needing a re-render
  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await api.post('/auth/refresh');
      const newToken = response.data.data.access_token;
      setAccessToken(newToken);
      tokenRef.current = newToken;
      return newToken;
    } catch {
      setAccessToken(null);
      tokenRef.current = null;
      return null;
    }
  }, []);

  // Wire up Axios interceptors once
  useEffect(() => {
    setupInterceptors(
      () => tokenRef.current,
      refreshAccessToken
    );
  }, [refreshAccessToken]);

  // Try to restore session on mount
  useEffect(() => {
    let cancelled = false;
    const initAuth = async () => {
      await refreshAccessToken();
      if (!cancelled) setLoading(false);
    };
    initAuth();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data.data.access_token;
    setAccessToken(token);
    tokenRef.current = token;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
      tokenRef.current = null;
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
