import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  userName: string;
  setIsAuthenticated: (value: boolean) => void;
  setUserName: (name: string) => void;
  checkAuthStatus: () => Promise<void>;
}
export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  userName: '',
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUserName: (name) => set({ userName: name }),
  checkAuthStatus: async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        const user = JSON.parse(credentials.password);
        set({ isAuthenticated: true, userName: user.profile.first_name });
      } else {
        set({ isAuthenticated: false, userName: '' });
      }
    } catch (error) {
      console.error('Failed to check auth status', error);
    }
  },
}));
// Custom hook to handle redirection based on auth status
export const useAuthRedirect = () => {
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthStatus();
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    };

    initializeAuth();
  }, [isAuthenticated, checkAuthStatus, router]);
};