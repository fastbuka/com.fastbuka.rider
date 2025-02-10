import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'https://dev.fastbuka.com/api/v1',
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/login', { email, password });
    await AsyncStorage.setItem('authToken', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
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

export const deleteRider = async () => {
  try {
    const response = await apiClient.delete('/rider');
    return response.data;
  } catch (error) {
    console.error('Delete rider failed', error);
    throw error;
  }
};

export const acceptOrder = async (orderUuid: string) => {
  try {
    const response = await apiClient.post(`/rider/accept/${orderUuid}`);
    return response.data;
  } catch (error) {
    console.error('Accept order failed', error);
    throw error;
  }
};