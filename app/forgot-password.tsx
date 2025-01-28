import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const ForgotPassword = () => {
  const [activeTab, setActiveTab] = useState('email');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [tabPosition] = useState(new Animated.Value(0));
  const router = useRouter();

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    Animated.spring(tabPosition, {
      toValue: tab === 'email' ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/logo.png')}
          style={[styles.logo, { height: height * 0.1 }]}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.headerText}>Reset Password</Text>
      <Text style={styles.subText}>
        Select your preferred method to reset your password. We'll send you instructions to get back into your account.
      </Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'email' && styles.activeTab]}
          onPress={() => switchTab('email')}
        >
          <Ionicons 
            name="mail-outline" 
            size={24} 
            color={activeTab === 'email' ? '#22c55e' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'email' && styles.activeTabText
          ]}>Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
          onPress={() => switchTab('phone')}
        >
          <Ionicons 
            name="phone-portrait-outline" 
            size={24} 
            color={activeTab === 'phone' ? '#22c55e' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'phone' && styles.activeTabText
          ]}>Phone</Text>
        </TouchableOpacity>
        
        <Animated.View 
          style={[
            styles.tabIndicator,
            {
              transform: [{
                translateX: tabPosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, (width - 40) / 2], // Adjusted to account for container padding
                }),
              }],
            },
          ]} 
        />
      </View>

      {activeTab === 'email' ? (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#ccc"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>
      )}

      <TouchableOpacity style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Send Reset Instructions</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backContainer}
      >
        <Ionicons name="arrow-back" size={20} color="#666" />
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    aspectRatio: 1,
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Fustat-Bold',
    color: '#22c55e',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    fontFamily: 'Fustat-Regular',
    color: '#666',
    marginBottom: 30,
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    position: 'relative',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 5,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 1,
  },
  activeTab: {
    borderRadius: 20,
  },
  tabText: {
    fontFamily: 'Fustat-Medium',
    color: '#666',
    fontSize: 14,
  },
  activeTabText: {
    color: '#22c55e',
  },
  tabIndicator: {
    position: 'absolute',
    width: '50%',
    height: '110%',
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Fustat-Medium',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Fustat-Regular',
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  resetButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Fustat-Bold',
    textAlign: 'center',
  },
  backContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  backText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Fustat-Medium',
  },
});

export default ForgotPassword;