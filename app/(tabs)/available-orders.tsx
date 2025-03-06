import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useOrdersStore } from '@/store/ordersStore';
import { useEffect, useState } from 'react';
import { getRiderOrders, acceptOrder } from '@/services/api';

interface Order {
  uuid: string;
  vendor: {
    address: string;
    latitude: number;
    longitude: number;
  };
  delivery_address: string;
  distance: number | null;
  estimatedTime: number | null;
  total_amount: number;
}

export default function AvailableOrders() {
  const setAvailableOrdersCount = useOrdersStore((state) => state.setAvailableOrdersCount);
  const [waitingOrders, setWaitingOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getRiderOrders(6.426, 3.424); // Example coordinates
        if (response && response.length > 0) {
          setWaitingOrders(response);
        } else {
          console.error('Failed to fetch orders: Response data is undefined');
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    setAvailableOrdersCount(waitingOrders.length);
  }, [waitingOrders.length]);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await acceptOrder(orderId);
      console.log('Order accepted:', orderId);
      // Optionally, remove the accepted order from the waitingOrders state
      setWaitingOrders(waitingOrders.filter(order => order.uuid !== orderId));
    } catch (error) {
      console.error('Failed to accept order:', error);
    }
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
            <View key={order.uuid} style={styles.orderCard}>
              <View style={styles.orderDetails}>
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={20} color="#22c55e" />
                  <View>
                    <Text style={styles.locationText}>Pickup: {order.vendor.address}</Text>
                    <Text style={styles.locationText}>Dropoff: {order.delivery_address}</Text>
                  </View>
                </View>
                
                <View style={styles.orderStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="map" size={16} color="#666" />
                    <Text style={styles.orderStat}>{order.distance ? `${order.distance.toFixed(2)} km` : 'N/A'}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.orderStat}>{order.estimatedTime ? `${order.estimatedTime.toFixed(2)} min` : 'N/A'}</Text>
                  </View>
                  <Text style={styles.orderAmount}>NGN{order.total_amount}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.acceptButton}
                  onPress={() => handleAcceptOrder(order.uuid)}>
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
    marginTop: 60,
    padding: 20,
    backgroundColor: '#0C513F',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
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