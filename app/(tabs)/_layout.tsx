import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Text } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';
import { useOrdersStore } from '@/store/ordersStore';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();
  const availableOrdersCount = useOrdersStore((state) => state.availableOrdersCount);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: 85,
          },
          default: {
            height: 85,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="active-orders"
        options={{
          title: 'Active',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bicycle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="available-orders"
        options={{
          title: 'Available',
          tabBarIcon: ({ color }) => (
            <View>
              <View style={{
                backgroundColor: Colors[colorScheme ?? 'light'].tint,
                borderRadius: 30,
                padding: 15,
                marginBottom: 30,
              }}>
                <IconSymbol size={32} name="shippingbox.fill" color="#FFFFFF" />
              </View>
              {availableOrdersCount > 0 && (
                <View style={{
                  position: 'absolute',
                  right: -6,
                  top: -6,
                  backgroundColor: '#ef4444',
                  borderRadius: 12,
                  minWidth: 24,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}>
                    {availableOrdersCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Earnings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="dollarsign.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
