import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'https://dev.fastbuka.com/api/v1',
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    console.log('Interceptor Token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error accessing AsyncStorage:', error);
  }
  return config;
});

export const login = async (email: string, password: string) => {
  try {
    console.log('Login request with:', { email, password });
    const response = await apiClient.post('/auth/login', { email, password });
    console.log('API Response:', response.data);

    const token = response.data.data.token;
    const user = response.data.data.user;
    if (!token) {
      throw new Error('Token not found in response');
    }

    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    console.log('Login successful', response.data);

    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const register = async (userData: any) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed', error);
    throw error;
  }
};

export const verifyEmail = async (verificationData: any) => {
  try {
    const response = await apiClient.post('/auth/verify_email', verificationData);
    return response.data;
  } catch (error) {
    console.error('Email verification failed', error);
    throw error;
  }
};

export const createRider = async (riderData: any) => {
  try {
    const response = await apiClient.post('/rider', riderData);
    return response.data;
  } catch (error) {
    console.error('Create rider failed', error);
    throw error;
  }
};

export const fetchRiderOrders = async (longitude: number, latitude: number) => {
  try {
    const response = await apiClient.get('/rider', { 
      params: { longitude, latitude } 
    });
    return response.data;
  } catch (error) {
    console.error('Fetch rider orders failed', error);
    throw error;
  }
};

export const updateRider = async (riderData: any) => {
  try {
    const response = await apiClient.patch('/rider', riderData);
    return response.data;
  } catch (error) {
    console.error('Update rider failed', error);
    throw error;
  }
};


export const getRiderEarnings = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authorization token is missing');
    }
    const response = await apiClient.get('/rider/earnings', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Get rider earnings failed', error);
    throw error;
  }
};

export const getRiderDashboard = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authorization token is missing');
    }
    const response = await apiClient.get('/rider/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Get rider dashboard failed', error);
    throw error;
  }
};

export const getRiderHistory = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authorization token is missing');
    }
    const response = await apiClient.get('/rider/history', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Get rider history failed', error);
    throw error;
  }
};

export const getRiderOrders = async (longitude: number, latitude: number) => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authorization token is missing');
    }
    const response = await apiClient.get('/rider/orders', {
      params: { longitude, latitude },
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Available Orders:', response.data.data.orders); // Log available orders to the console
    return response.data.data.orders;
  } catch (error) {
    console.error('Get rider orders failed', error);
    throw error;
  }
};

export const acceptOrder = async (orderUuid: string) => {
  try {
    const response = await apiClient.post(`/rider/accept_order/${orderUuid}`);
    return response.data;
  } catch (error) {
    console.error('Accept order failed', error);
    throw error;
  }
};

export const deliverOrder = async (orderUuid: string) => {
  try {
    const response = await apiClient.post(`/rider/deliver_order/${orderUuid}`);
    return response.data;
  } catch (error) {
    console.error('Deliver order failed', error);
    throw error;
  }
};

