import { Image, StyleSheet, Platform, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week'>('today');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Mock user data - replace with real data
  const userData = {
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/100',
    location: 'Lagos CBD'
  };
  
  // Mock data - replace with real data
  const earningsData = {
    today: {
      total: '₦8450.00',
      trips: 10,
      onlineHours: 6.5,
      breakdown: [
        { id: 1, time: '14:30', amount: '₦2995.00', location: 'Lagos CBD' },
        { id: 2, time: '13:15', amount: '₦4895.00', location: 'Ikeja' },
        { id: 3, time: '11:45', amount: '₦1895.00', location: 'Victoria Island' },
      ]
    },
    week: {
      total: '₦2,450.00', 
      trips: 45,
      onlineHours: 38.5,
      breakdown: [
        { id: 4, time: 'Mon', amount: '₦1450.00', location: 'Daily Total' },
        { id: 5, time: 'Tue', amount: '₦1520.00', location: 'Daily Total' },
        { id: 6, time: 'Wed', amount: '₦1480.00', location: 'Daily Total' },
      ]
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Failed to fetch the auth token from storage', error);
      }
    };

    checkLoginStatus();
  }, []);

  if (!isLoggedIn) {
    return <Text>Please log in</Text>;
  }

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Image 
              source={{ uri: userData.avatar }} 
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{userData.name}</Text>
              <View style={styles.locationInfo}>
                <Ionicons name="location" size={16} color="#666" />
                <Text style={styles.locationText}>{userData.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Earnings Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Earnings</Text>
          <View style={styles.periodSelector}>
            <TouchableOpacity 
              style={[styles.periodButton, selectedPeriod === 'today' && styles.selectedPeriod]}
              onPress={() => setSelectedPeriod('today')}>
              <Text style={[styles.periodText, selectedPeriod === 'today' && styles.selectedPeriodText]}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.periodButton, selectedPeriod === 'week' && styles.selectedPeriod]}
              onPress={() => setSelectedPeriod('week')}>
              <Text style={[styles.periodText, selectedPeriod === 'week' && styles.selectedPeriodText]}>This Week</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.earningsCard}>
          <Text style={styles.totalAmount}>{earningsData[selectedPeriod].total}</Text>
          <Text style={styles.totalLabel}>Total Earnings</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="bicycle" size={24} color="#22c55e" />
              <Text style={styles.statValue}>{earningsData[selectedPeriod].trips}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={24} color="#22c55e" />
              <Text style={styles.statValue}>{earningsData[selectedPeriod].onlineHours}hrs</Text>
              <Text style={styles.statLabel}>Online Time</Text>
            </View>
          </View>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {earningsData[selectedPeriod].breakdown.map(trip => (
            <View key={trip.id} style={styles.tripItem}>
              <View>
                <Text style={styles.tripTime}>{trip.time}</Text>
                <Text style={styles.tripLocation}>{trip.location}</Text>
              </View>
              <Text style={styles.tripAmount}>{trip.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedPeriod: {
    backgroundColor: '#22c55e',
  },
  periodText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedPeriodText: {
    color: '#fff',
  },
  earningsCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#22c55e',
    textAlign: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  historySection: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tripItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  tripTime: {
    fontSize: 16,
    fontWeight: '500',
  },
  tripLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tripAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
  },
});
