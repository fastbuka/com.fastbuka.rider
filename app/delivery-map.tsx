import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';

export default function DeliveryMap() {
  const params = useLocalSearchParams();
  const pickupLat = Number(params.pickupLat) || 6.524379;  // Default coordinates for Lagos, Nigeria
  const pickupLng = Number(params.pickupLng) || 3.379206;
  const dropoffLat = Number(params.dropoffLat) || 6.524379;
  const dropoffLng = Number(params.dropoffLng) || 3.379206;

  const initialRegion = {
    latitude: pickupLat,
    longitude: pickupLng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: pickupLat,
            longitude: pickupLng,
          }}
          title="Pickup Location"
          pinColor="green"
        />
        <Marker
          coordinate={{
            latitude: dropoffLat,
            longitude: dropoffLng,
          }}
          title="Dropoff Location"
          pinColor="red"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
