import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string;
  userFirstName: string;
  userLastName: string;
  email: string;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const userJson = await AsyncStorage.getItem('user');
        console.log('Stored Token:', token);
        console.log('Stored User:', userJson);

        if (token && userJson) {
          const user = JSON.parse(userJson);
          setIsAuthenticated(true);
          setEmail(user?.email || '');
          setUserName(user?.profile?.username || '');
          setUserFirstName(user?.profile?.first_name || '');
          setUserLastName(user?.profile?.last_name || '');
          console.log('User authenticated, redirecting to dashboard');
          router.replace('/(tabs)');
        } else {
          console.log('No valid token found, redirecting to login');
          router.replace('/login');
        }
      } catch (error) {
        console.error('Failed to check auth status', error);
        router.replace('/login');
      }
    };

    checkAuthStatus();
  }, [router]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', { email, password });
      const response = await fetch('https://dev.fastbuka.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      const token = data.data.token;
      const user = data.data.user;

      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      console.log('Stored Token:', token);
      console.log('Stored User:', user);

      setIsAuthenticated(true);
      setEmail(user.email);
      setUserName(user.profile.username);
      setUserFirstName(user.profile.first_name);
      setUserLastName(user.profile.last_name);
      console.log('Sign in successful, redirecting to dashboard');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Call the logout endpoint to invalidate the token
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        const response = await fetch('https://dev.fastbuka.com/api/v1/auth/logout', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Use the stored token for authentication
          },
        });

        const data = await response.json();
        console.log('Logout API Response:', data);

        if (!data.success) {
          throw new Error(data.message || 'Logout failed');
        }
      }

      // Clear the AsyncStorage token and user data
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
      
      setIsAuthenticated(false);
      setUserName('');
      console.log('User signed out, redirecting to login');
      router.replace('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, userName, userFirstName, userLastName, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
