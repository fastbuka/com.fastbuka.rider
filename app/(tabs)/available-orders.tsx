import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useOrdersStore } from '@/store/ordersStore';
import { useEffect } from 'react';

export default function AvailableOrders() {
  const setAvailableOrdersCount = useOrdersStore((state) => state.setAvailableOrdersCount);
  
  const waitingOrders = [
    {
      id: 1,
      pickupLocation: 'Victoria Island, Lagos',
      dropoffLocation: 'Ikoyi, Lagos',
      amount: '₦700.00',
      distance: '3.2km',
      estimatedTime: '15 mins'
    },
    {
      id: 2, 
      pickupLocation: 'Surulere, Lagos',
      dropoffLocation: 'Yaba, Lagos',
      amount: '₦800.00',
      distance: '4.5km',
      estimatedTime: '20 mins'
    },
    {
      id: 3,
      pickupLocation: 'Lagos Island, Lagos',
      dropoffLocation: 'Apapa, Lagos',
      amount: '₦900.00',
      distance: '5.1km',
      estimatedTime: '25 mins'
    },
    {
      id: 4,
      pickupLocation: 'Obalende, Lagos',
      dropoffLocation: 'Marina, Lagos',
      amount: '₦700.00',
      distance: '2.8km',
      estimatedTime: '12 mins'
    },
    {
      id: 5,
      pickupLocation: 'Eko Atlantic, Lagos',
      dropoffLocation: 'Victoria Garden City, Lagos',
      amount: '₦1,000.00',
      distance: '4.0km',
      estimatedTime: '18 mins'
    },
    {
      id: 6,
      pickupLocation: 'Lagos Marina, Lagos',
      dropoffLocation: 'Ebute Metta, Lagos',
      amount: '₦850.00',
      distance: '3.5km',
      estimatedTime: '16 mins'
    },
    {
      id: 7,
      pickupLocation: 'Ikeja, Lagos',
      dropoffLocation: 'Agege, Lagos',
      amount: '₦750.00',
      distance: '4.2km',
      estimatedTime: '19 mins'
    },
    {
      id: 8,
      pickupLocation: 'Oshodi, Lagos',
      dropoffLocation: 'Isolo, Lagos',
      amount: '₦800.00',
      distance: '3.8km',
      estimatedTime: '17 mins'
    },
    {
      id: 9,
      pickupLocation: 'Mushin, Lagos',
      dropoffLocation: 'Ojuelegba, Lagos',
      amount: '₦900.00',
      distance: '4.8km',
      estimatedTime: '22 mins'
    },
    {
      id: 10,
      pickupLocation: 'Shomolu, Lagos',
      dropoffLocation: 'Bariga, Lagos',
      amount: '₦1,100.00',
      distance: '5.5km',
      estimatedTime: '26 mins'
    },
    {
      id: 11,
      pickupLocation: 'Ketu, Lagos',
      dropoffLocation: 'Alapere, Lagos',
      amount: '₦950.00',
      distance: '4.9km',
      estimatedTime: '23 mins'
    },
  ];

  useEffect(() => {
    setAvailableOrdersCount(waitingOrders.length);
  }, [waitingOrders.length]);

  const handleAcceptOrder = (orderId: number) => {
    console.log('Accepted order:', orderId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Orders</Text>
        <Text style={styles.subtitle}>New delivery requests in your area</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.ordersContainer}>
          {waitingOrders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderDetails}>
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={20} color="#22c55e" />
                  <View>
                    <Text style={styles.locationText}>Pickup: {order.pickupLocation}</Text>
                    <Text style={styles.locationText}>Dropoff: {order.dropoffLocation}</Text>
                  </View>
                </View>
                
                <View style={styles.orderStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="map" size={16} color="#666" />
                    <Text style={styles.orderStat}>{order.distance}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.orderStat}>{order.estimatedTime}</Text>
                  </View>
                  <Text style={styles.orderAmount}>{order.amount}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.acceptButton}
                  onPress={() => handleAcceptOrder(order.id)}>
                  <Text style={styles.acceptButtonText}>Accept Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  ordersContainer: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderDetails: {
    gap: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  orderStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  orderStat: {
    color: '#666',
    fontSize: 14,
  },
  orderAmount: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  acceptButton: {
    backgroundColor: '#22c55e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});