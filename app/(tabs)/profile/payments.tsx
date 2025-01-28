import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentsScreen() {
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: '1',
      bankName: 'First Bank of Nigeria',
      accountNumber: '1234567890',
      accountHolder: 'John Doe',
      branch: 'Ikeja Branch',
    },
    {
      id: '2', 
      bankName: 'Zenith Bank',
      accountNumber: '0987654321',
      accountHolder: 'John Doe',
      branch: 'Victoria Island Branch',
    },
    {
      id: '3',
      bankName: 'Guaranty Trust Bank',
      accountNumber: '1357924680',
      accountHolder: 'John Doe', 
      branch: 'Lekki Branch',
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newAccount, setNewAccount] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    branch: '',
  });

  const requestOTP = () => {
    // In real app, this would trigger OTP send to user's phone
    return new Promise((resolve) => {
      Alert.prompt(
        "Enter OTP",
        "Please enter the OTP sent to your phone",
        [
          {
            text: "Cancel",
            onPress: () => resolve(false),
            style: "cancel"
          },
          {
            text: "Verify",
            onPress: (otp) => resolve(otp === "1234") // Mock validation
          }
        ]
      );
    });
  };

  const handleRemoveAccount = async (id: string) => {
    const otpValid = await requestOTP();
    if (otpValid) {
      setBankAccounts(prev => prev.filter(acc => acc.id !== id));
      Alert.alert("Success", "Bank account removed successfully");
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again");
    }
  };

  const handleAddNewAccount = async () => {
    // Validate fields
    if (!newAccount.bankName || !newAccount.accountNumber || 
        !newAccount.accountHolder || !newAccount.branch) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const otpValid = await requestOTP();
    if (otpValid) {
      setBankAccounts(prev => [...prev, {
        id: (prev.length + 1).toString(),
        ...newAccount
      }]);
      setModalVisible(false);
      setNewAccount({ bankName: '', accountNumber: '', accountHolder: '', branch: '' });
      Alert.alert('Success', 'Bank account added successfully');
    } else {
      Alert.alert('Error', 'Invalid OTP. Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.title}>Your Payment Methods</Text>
          <Text style={styles.subtitle}>Manage your bank accounts for receiving payments</Text>
        </View>
      </View>

      <FlatList
        data={bankAccounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.accountContainer}>
            <View style={styles.accountHeader}>
              <Ionicons name="business-outline" size={24} color="#0A9462" />
              <Text style={styles.bankName}>{item.bankName}</Text>
            </View>
            <Text style={styles.accountDetails}>Account Holder: {item.accountHolder}</Text>
            <Text style={styles.accountDetails}>Account Number: {item.accountNumber}</Text>
            <Text style={styles.accountDetails}>Branch: {item.branch}</Text>
            
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => handleRemoveAccount(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              <Text style={styles.removeButtonText}>Remove Account</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity 
        style={styles.fabButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.fabCircle}>
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Bank Account</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Bank Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter bank name"
                value={newAccount.bankName}
                onChangeText={(text) => setNewAccount(prev => ({ ...prev, bankName: text }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter account number"
                keyboardType="numeric"
                value={newAccount.accountNumber}
                onChangeText={(text) => setNewAccount(prev => ({ ...prev, accountNumber: text }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Account Holder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter account holder name"
                value={newAccount.accountHolder}
                onChangeText={(text) => setNewAccount(prev => ({ ...prev, accountHolder: text }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Branch Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter branch name"
                value={newAccount.branch}
                onChangeText={(text) => setNewAccount(prev => ({ ...prev, branch: text }))}
              />
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleAddNewAccount}
            >
              <Text style={styles.submitButtonText}>Add Bank Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  accountContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bankName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  accountDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
  },
  removeButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
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
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  submitButton: {
    backgroundColor: '#0A9462',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fabButton: {
    position: 'absolute',
    bottom: '50%',
    right: 20,
    alignItems: 'flex-end',
    zIndex: 1,
  },
  fabCircle: {
    backgroundColor: '#0A9462',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});