import { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Address = {
  id: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'Home',
      address: '12, Opebi Road, Ikeja',
      city: 'Lagos',
      state: 'Lagos',
      zip: '100001',
    },
    {
      id: '2',
      type: 'Work',
      address: 'Plot 123, Victoria Island',
      city: 'Lagos',
      state: 'Lagos',
      zip: '101001',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Address>({
    id: '',
    type: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingAddress(null);
    setFormData({
      id: Date.now().toString(),
      type: '',
      address: '',
      city: '',
      state: '',
      zip: '',
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id ? formData : addr
      ));
    } else {
      // Add new address
      setAddresses([...addresses, formData]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Text style={styles.addressType}>{item.type}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  onPress={() => handleEdit(item)}
                  style={styles.iconButton}
                >
                  <Ionicons name="create-outline" size={24} color="#0A9462" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleDelete(item.id)}
                  style={styles.iconButton}
                >
                  <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.addressText}>{item.address}</Text>
            <Text style={styles.addressText}>{`${item.city}, ${item.state} ${item.zip}`}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Address Type</Text>
                <TextInput
                  style={styles.input}
                  value={formData.type}
                  onChangeText={(text) => setFormData({...formData, type: text})}
                  placeholder="Home, Work, etc."
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Street Address</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address}
                  onChangeText={(text) => setFormData({...formData, address: text})}
                  placeholder="Enter street address"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={formData.city}
                  onChangeText={(text) => setFormData({...formData, city: text})}
                  placeholder="Enter city"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>State</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.state}
                    onChangeText={(text) => setFormData({...formData, state: text})}
                    placeholder="State"
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>ZIP Code</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.zip}
                    onChangeText={(text) => setFormData({...formData, zip: text})}
                    placeholder="ZIP"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save Address</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
  addressCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fffff0',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 12,
  },
  addressType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  addButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 'auto',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  closeButton: {
    padding: 5,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#0A9462',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});