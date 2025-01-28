import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: 'Edit Profile',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="addresses"
        options={{
          title: 'Saved Addresses',
        }}
      />
      <Stack.Screen
        name="payments"
        options={{
          title: 'Payment Methods',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="support"
        options={{
          title: 'Help & Support',
        }}
      />
    </Stack>
  );
}