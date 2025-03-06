// useLocation.ts
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const useLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getLocation = async () => {
      setIsLoading(true);
      try {
        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }

        // Fetch current location
        const location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (err) {
        setError('Error fetching location');
        console.error('Error fetching location:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getLocation();
  }, []); // Empty array ensures this runs only once when the component mounts

  return { location, error, isLoading };
};

export default useLocation;
