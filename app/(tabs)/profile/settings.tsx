import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, Modal, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = {
  code: string;
  name: string;
};

type Region = {
  code: string;
  name: string;
};

export default function SettingsScreen() {
  const [languageModal, setLanguageModal] = useState(false);
  const [regionModal, setRegionModal] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [currentOtp, setCurrentOtp] = useState('');
  const [newOtp, setNewOtp] = useState('');
  const [confirmNewOtp, setConfirmNewOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    code: 'en',
    name: 'English'
  });
  
  const [selectedRegion, setSelectedRegion] = useState<Region>({
    code: 'ZM',
    name: 'Zambia'
  });

  const languages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'pid', name: 'Pidgin' },
    { code: 'bem', name: 'Bemba' },
    { code: 'nya', name: 'Nyanja' },
    { code: 'ton', name: 'Tonga' }
  ];

  const regions: Region[] = [
    { code: 'NG', name: 'Nigeria' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'KE', name: 'Kenya' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'GH', name: 'Ghana' },
    { code: 'BJ', name: 'Benin (Cotonou)' }
  ];

  const toggleDarkMode = async () => {
    try {
      await AsyncStorage.setItem('darkMode', (!darkMode).toString());
      setDarkMode(!darkMode);
      // Implement your dark mode logic here
    } catch (error) {
      console.error('Error saving dark mode preference:', error);
    }
  };

  const togglePushNotifications = async (value: boolean) => {
    try {
      setPushNotifications(value);
      await AsyncStorage.setItem('pushNotifications', value.toString());
      if (value) {
        // Request push notification permissions
        // Implement your push notification logic here
      }
    } catch (error) {
      console.error('Error saving notification preference:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => setLanguageModal(true)}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="language-outline" size={24} color="#0A5F3C" />
            <Text style={styles.settingLabel}>Language</Text>
          </View>
          <View style={styles.settingRight}>
            <Text style={styles.settingValue}>{selectedLanguage.name}</Text>
            <Ionicons name="chevron-forward" size={20} color="#2E8B57" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => setRegionModal(true)}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="globe-outline" size={24} color="#0A5F3C" />
            <Text style={styles.settingLabel}>Region</Text>
          </View>
          <View style={styles.settingRight}>
            <Text style={styles.settingValue}>{selectedRegion.name}</Text>
            <Ionicons name="chevron-forward" size={20} color="#2E8B57" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => setPrivacyModal(true)}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="lock-closed-outline" size={24} color="#0A5F3C" />
            <Text style={styles.settingLabel}>Privacy Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#2E8B57" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={24} color="#0A5F3C" />
            <Text style={styles.settingLabel}>Push Notifications</Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={togglePushNotifications}
            trackColor={{ false: '#A8E4BC', true: '#2E8B57' }}
            thumbColor={pushNotifications ? '#0A5F3C' : '#E8F5E9'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon-outline" size={24} color="#0A5F3C" />
            <Text style={styles.settingLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#A8E4BC', true: '#2E8B57' }}
            thumbColor={darkMode ? '#0A5F3C' : '#E8F5E9'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security Settings</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => setOtpModalVisible(true)}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="key-outline" size={24} color="#0A5F3C" />
            <Text style={styles.settingLabel}>Change Transaction OTP</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#2E8B57" />
        </TouchableOpacity>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={languageModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setLanguageModal(false)}>
                <Ionicons name="close" size={24} color="#0A5F3C" />
              </TouchableOpacity>
            </View>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedLanguage(language);
                  setLanguageModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{language.name}</Text>
                {selectedLanguage.code === language.code && (
                  <Ionicons name="checkmark" size={24} color="#0A9462" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Region Selection Modal */}
      <Modal
        visible={regionModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Region</Text>
              <TouchableOpacity onPress={() => setRegionModal(false)}>
                <Ionicons name="close" size={24} color="#0A5F3C" />
              </TouchableOpacity>
            </View>
            {regions.map((region) => (
              <TouchableOpacity
                key={region.code}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedRegion(region);
                  setRegionModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{region.name}</Text>
                {selectedRegion.code === region.code && (
                  <Ionicons name="checkmark" size={24} color="#0A9462" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Privacy Settings Modal */}
      <Modal
        visible={privacyModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Settings</Text>
              <TouchableOpacity onPress={() => setPrivacyModal(false)}>
                <Ionicons name="close" size={24} color="#0A5F3C" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.privacySection}>
                <Text style={styles.privacyTitle}>Data Collection</Text>
                <Text style={styles.privacyText}>
                  We collect minimal data necessary to provide our services. This includes:
                </Text>
                <Text style={styles.privacyBullet}>• Location data for delivery</Text>
                <Text style={styles.privacyBullet}>• Order history</Text>
                <Text style={styles.privacyBullet}>• Basic profile information</Text>
              </View>

              <View style={styles.privacySection}>
                <Text style={styles.privacyTitle}>Your Rights</Text>
                <Text style={styles.privacyText}>
                  You have the right to:
                </Text>
                <Text style={styles.privacyBullet}>• Access your data</Text>
                <Text style={styles.privacyBullet}>• Request data deletion</Text>
                <Text style={styles.privacyBullet}>• Opt out of marketing</Text>
              </View>

              <TouchableOpacity 
                style={styles.privacyButton}
                onPress={() => {
                  setPrivacyModal(false);
                  router.push('/(tabs)/profile/privacy-policy');
                }}
              >
                <Text style={styles.privacyButtonText}>View Full Privacy Policy</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* OTP Change Modal */}
      <Modal
        visible={otpModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Transaction OTP</Text>
              <TouchableOpacity onPress={() => {
                setOtpModalVisible(false);
                setCurrentOtp('');
                setNewOtp('');
                setConfirmNewOtp('');
                setOtpError('');
              }}>
                <Ionicons name="close" size={24} color="#0A5F3C" />
              </TouchableOpacity>
            </View>

            <View style={styles.otpForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current OTP</Text>
                <TextInput
                  style={styles.otpInput}
                  value={currentOtp}
                  onChangeText={setCurrentOtp}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  placeholder="Enter current OTP"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New OTP</Text>
                <TextInput
                  style={styles.otpInput}
                  value={newOtp}
                  onChangeText={setNewOtp}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  placeholder="Enter new OTP"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm New OTP</Text>
                <TextInput
                  style={styles.otpInput}
                  value={confirmNewOtp}
                  onChangeText={setConfirmNewOtp}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  placeholder="Confirm new OTP"
                />
              </View>

              {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

              <TouchableOpacity 
                style={styles.changeOtpButton}
                onPress={() => {
                  if (currentOtp !== '1234') { // Mock validation
                    setOtpError('Current OTP is incorrect');
                    return;
                  }
                  if (newOtp !== confirmNewOtp) {
                    setOtpError('New OTP and confirmation do not match');
                    return;
                  }
                  if (newOtp.length !== 4) {
                    setOtpError('OTP must be 4 digits');
                    return;
                  }
                  // Handle OTP change success
                  Alert.alert('Success', 'OTP has been changed successfully');
                  setOtpModalVisible(false);
                  setCurrentOtp('');
                  setNewOtp('');
                  setConfirmNewOtp('');
                  setOtpError('');
                }}
              >
                <Text style={styles.changeOtpButtonText}>Change OTP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#A8E4BC',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0A5F3C',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
    // color: '#0A5F3C',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#2E8B57',
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(50, 50, 50, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A5F3C',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#A8E4BC',
  },
  modalItemText: {
    fontSize: 16,
    color: '#0A5F3C',
  },
  privacySection: {
    marginBottom: 20,
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0A5F3C',
  },
  privacyText: {
    fontSize: 16,
    color: '#2E8B57',
    marginBottom: 10,
  },
  privacyBullet: {
    fontSize: 16,
    color: '#2E8B57',
    marginLeft: 10,
    marginBottom: 5,
  },
  privacyButton: {
    backgroundColor: '#0A9462',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  privacyButtonText: {
    color: '#E8F5E9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpForm: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
  },
  changeOtpButton: {
    backgroundColor: '#0A9462',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  changeOtpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});