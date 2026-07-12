import { createContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import api from '../api/client';
import { resetSubjects } from '../store/subjectsSlice';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('studyhub_token');
    if (!token) {
      localStorage.removeItem('studyhub_user');
      return null;
    }
    try { return JSON.parse(localStorage.getItem('studyhub_user')); } catch { return null; }
  });
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('studyhub_token');
    if (!token) return;

    api.get('/auth/me')
      .then(({ data }) => {
        setUser(data);
        localStorage.setItem('studyhub_user', JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem('studyhub_token');
        localStorage.removeItem('studyhub_user');
        dispatch(resetSubjects());
        setUser(null);
      });
  }, [dispatch]);

  const login = async (username, password) => {
    setAuthError(null);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('studyhub_token', data.token);
      localStorage.setItem('studyhub_user', JSON.stringify(data.user));
      dispatch(resetSubjects());
      setUser(data.user);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.message || 'შესვლა ვერ მოხერხდა');
      return false;
    }
  };

  const register = async (username, password, name) => {
    setAuthError(null);
    try {
      const { data } = await api.post('/auth/register', { username, password, name });
      localStorage.setItem('studyhub_token', data.token);
      localStorage.setItem('studyhub_user', JSON.stringify(data.user));
      dispatch(resetSubjects());
      setUser(data.user);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.message || 'რეგისტრაცია ვერ მოხერხდა');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('studyhub_token');
    localStorage.removeItem('studyhub_user');
    dispatch(resetSubjects());
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, authError, setAuthError, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}