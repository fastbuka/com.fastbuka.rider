// Active Orders screen
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Link } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function ActiveOrders() {
    // Mock data - replace with real data from API/backend
    const activeOrders = [
        {
            id: '1',
            customerName: 'John Doe',
            pickupLocation: {
                address: 'Victoria Island, Lagos',
                coordinates: { lat: 6.432333, lng: 3.401667 }
            },
            dropoffLocation: {
                address: 'Ikoyi, Lagos',
                coordinates: { lat: 6.450000, lng: 3.416667 }
            },
            amount: 700, // Changed to Naira symbol and range
            status: 'Picking Up',
            items: ['Chicken Wings', 'Chips'],
            expectedDeliveryTime: '30 mins',
            incentive: 'K25 bonus for early delivery'
        },
        {
            id: '2', 
            customerName: 'Mary Smith',
            pickupLocation: {
                address: 'Surulere, Lagos',
                coordinates: { lat: 6.483333, lng: 3.366667 }
            },
            dropoffLocation: {
                address: 'Yaba, Lagos',
                coordinates: { lat: 6.516667, lng: 3.383333 }
            },
            amount: 3000, // Changed to Naira symbol and range
            status: 'On The Way',
            items: ['Pizza', 'Coca Cola'],
            expectedDeliveryTime: '25 mins',
            incentive: 'K20 bonus for early delivery'
        }
    ];

    const updateOrderStatus = (orderId: string, newStatus: string) => {
        // Implementation for status update
        // This would typically involve an API call
        console.log(`Updating order ${orderId} to ${newStatus}`);
    };

    const tabBarHeight = useBottomTabBarHeight();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                    <Text style={styles.headerText}>Active Deliveries</Text>
                    <Text style={styles.subtitle}>Jobs you've accepted </Text>

                </View>
            <ScrollView style={[styles.container, { paddingBottom: tabBarHeight + 16 }]}>
                

                {activeOrders.map(order => (
                    <ThemedView key={order.id} style={styles.orderCard}>
                        <View style={styles.orderHeader}>
                            <ThemedText style={styles.customerName}>{order.customerName}</ThemedText>
                            <ThemedText style={styles.status}>{order.status}</ThemedText>
                        </View>
                        
                        <Link 
                            href={{
                                pathname: "/delivery-map",
                                params: { 
                                    pickupLat: order.pickupLocation.coordinates.lat,
                                    pickupLng: order.pickupLocation.coordinates.lng,
                                    dropoffLat: order.dropoffLocation.coordinates.lat,
                                    dropoffLng: order.dropoffLocation.coordinates.lng
                                }
                            }}
                            asChild
                        >
                            <Pressable style={styles.mapButton}>
                                <ThemedText>View Route Map</ThemedText>
                            </Pressable>
                        </Link>

                        <ThemedText style={styles.location}>
                            📍 Pickup: {order.pickupLocation.address}
                        </ThemedText>
                        <ThemedText style={styles.location}>
                            🎯 Dropoff: {order.dropoffLocation.address}
                        </ThemedText>
                        
                        <ThemedText style={styles.timeInfo}>
                            Expected delivery time: {order.expectedDeliveryTime}
                        </ThemedText>

                        <ThemedText style={styles.incentiveText}>
                             {order.incentive}
                        </ThemedText>

                        {order.status === 'Picking Up' && (
                            <Pressable 
                                style={styles.statusButton}
                                onPress={() => updateOrderStatus(order.id, 'On The Way')}
                            >
                                <ThemedText style={styles.statusButtonText}>
                                    Mark as Picked Up
                                </ThemedText>
                            </Pressable>
                        )}

                        <View style={styles.itemsList}>
                            <ThemedText style={styles.itemsHeader}>Items:</ThemedText>
                            {order.items.map((item, index) => (
                                <ThemedText key={index} style={styles.item}>• {item}</ThemedText>
                            ))}
                        </View>

                        <View style={styles.amountContainer}>
                            <ThemedText style={styles.amount}>
                                Amount: ₦{order.amount.toFixed(2)}
                            </ThemedText>
                        </View>
                    </ThemedView>
                ))}
                <View style={{ height: tabBarHeight + 16 }}></View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingBottom: 100,
    },
    header: {
        marginTop: 60,
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#0C513F',
    },
    subtitle: {
        fontSize: 14,
        color: '#fff',
        marginTop: 5,
      },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold', 
        color: '#fff',
    },
    orderCard: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    customerName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    status: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4CAF50',
    },
    location: {
        fontSize: 16,
        marginBottom: 12,
    },
    itemsList: {
        marginBottom: 12,
    },
    itemsHeader: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    item: {
        fontSize: 14,
        marginLeft: 8,
    },
    amountContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 8,
        marginTop: 8,
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    mapButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
    },
    timeInfo: {
        fontSize: 16,
        marginVertical: 8,
    },
    incentiveText: {
        fontSize: 14,
        color: '#4CAF50',
        marginVertical: 4,
    },
    statusButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    statusButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});