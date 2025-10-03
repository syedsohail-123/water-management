// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const IDENTITY_POOL_ID = 'ap-south-1:ebfec4ff-ba7a-40a3-8cad-a1fa1cddd259';
const REGION = 'ap-south-1';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState(null);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedCredentials = localStorage.getItem('credentials');
      if (storedUser && storedCredentials) {
        setUser(JSON.parse(storedUser));
        setCredentials(JSON.parse(storedCredentials));
      }
    } catch (error) {
      console.log('No authenticated user:', error);
      setUser(null);
      setCredentials(null);
      localStorage.removeItem('user');
      localStorage.removeItem('credentials');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      if (email && password) {
        const credentialProvider = fromCognitoIdentityPool({
          client: new CognitoIdentityClient({ region: REGION }),
          identityPoolId: IDENTITY_POOL_ID,
        });
        
        const creds = await credentialProvider();
        setCredentials(creds);
        
        const userData = { email, id: Date.now().toString() };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('credentials', JSON.stringify(creds));
        
        return { success: true, user: userData };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password) => {
    try {
      if (email && password) {
        const credentialProvider = fromCognitoIdentityPool({
          client: new CognitoIdentityClient({ region: REGION }),
          identityPoolId: IDENTITY_POOL_ID,
        });
        
        const creds = await credentialProvider();
        setCredentials(creds);
        
        const userData = { email, id: Date.now().toString() };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('credentials', JSON.stringify(creds));
        
        return { success: true, user: userData };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setCredentials(null);
      localStorage.removeItem('user');
      localStorage.removeItem('credentials');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    credentials,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};