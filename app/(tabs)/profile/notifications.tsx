import { useState } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    orderUpdates: true,
    promotions: false,
    emailNotifications: true,
  });

  const toggleSwitch = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Push Notifications</Text>
          <Switch
            value={notifications.pushNotifications}
            onValueChange={() => toggleSwitch('pushNotifications')}
            ios_backgroundColor="#ccc"
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Order Updates</Text>
          <Switch
            value={notifications.orderUpdates}
            onValueChange={() => toggleSwitch('orderUpdates')}
            ios_backgroundColor="#ccc"
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Promotions & Offers</Text>
          <Switch
            value={notifications.promotions}
            onValueChange={() => toggleSwitch('promotions')}
            ios_backgroundColor="#ccc"
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Email Notifications</Text>
          <Switch
            value={notifications.emailNotifications}
            onValueChange={() => toggleSwitch('emailNotifications')}
            ios_backgroundColor="#ccc"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
});