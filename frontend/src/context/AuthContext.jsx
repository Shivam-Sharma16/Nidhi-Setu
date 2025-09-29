import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'normal' or 'nominee'

  // Set up axios defaults
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUserType = localStorage.getItem('userType');
      if (token) {
        try {
          // You can add a verify token endpoint to your backend
          // For now, we'll just set the user if token exists
          setUser({ token });
          setUserType(storedUserType || 'normal');
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password, type = 'normal') => {
    try {
      // Choose the appropriate API endpoint based on user type
      const apiEndpoint = type === 'nominee' 
        ? 'http://localhost:5000/api/nominees/login'
        : 'http://localhost:5000/api/users/login';
      
      const response = await axios.post(apiEndpoint, {
        email,
        password
      });
      
      const { token, userType: responseUserType } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userType', responseUserType || type);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ token });
      setUserType(responseUserType || type);
      return { success: true, userType: responseUserType || type };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (formData, type = 'normal') => {
    try {
      // Choose the appropriate API endpoint based on user type
      const apiEndpoint = type === 'nominee' 
        ? 'http://localhost:5000/api/nominees/register'
        : 'http://localhost:5000/api/users/register';
      
      const response = await axios.post(apiEndpoint, formData);
      
      const { token, userType: responseUserType } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userType', responseUserType || type);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ token });
      setUserType(responseUserType || type);
      return { success: true, userType: responseUserType || type };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const getUserProfile = async () => {
    try {
      // Choose the appropriate API endpoint based on user type
      const apiEndpoint = userType === 'nominee' 
        ? 'http://localhost:5000/api/nominees/profile'
        : 'http://localhost:5000/api/users/profile';
      
      const response = await axios.get(apiEndpoint);
      return { success: true, user: response.data.user || response.data.nominee };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch user profile' 
      };
    }
  };

  const logout = async () => {
    try {
      // Choose the appropriate API endpoint based on user type
      const apiEndpoint = userType === 'nominee' 
        ? 'http://localhost:5000/api/nominees/logout'
        : 'http://localhost:5000/api/users/logout';
      
      await axios.post(apiEndpoint);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setUserType(null);
    }
  };

  const value = {
    user,
    userType,
    login,
    signup,
    logout,
    getUserProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
