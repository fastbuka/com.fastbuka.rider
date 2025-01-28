import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SupportScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How can we help you?</Text>
        
        <TouchableOpacity style={styles.supportItem}>
          <View style={styles.supportLeft}>
            <Ionicons name="chatbubble-outline" size={24} color="#0A5F3C" />
            <View style={styles.supportText}>
              <Text style={styles.supportLabel}>Contact Support</Text>
              <Text style={styles.supportDescription}>Get help from our support team</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#2E8B57" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportItem}>
          <View style={styles.supportLeft}>
            <Ionicons name="document-text-outline" size={24} color="#0A5F3C" />
            <View style={styles.supportText}>
              <Text style={styles.supportLabel}>FAQs</Text>
              <Text style={styles.supportDescription}>Browse frequently asked questions</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#2E8B57" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportItem}>
          <View style={styles.supportLeft}>
            <Ionicons name="information-circle-outline" size={24} color="#0A5F3C" />
            <View style={styles.supportText}>
              <Text style={styles.supportLabel}>About Us</Text>
              <Text style={styles.supportDescription}>Learn more about our service</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#2E8B57" />
        </TouchableOpacity>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Contact Information</Text>
        <Text style={styles.contactText}>Email: support@fastbuka.com</Text>
        <Text style={styles.contactText}>Phone: 234-800-123-4567</Text>
        <Text style={styles.contactText}>Hours: Mon-Fri, 9AM-6PM WAT</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0A5F3C',
  },
  supportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#A8E4BC',
  },
  supportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  supportText: {
    marginLeft: 12,
    flex: 1,
  },
  supportLabel: {
    fontSize: 16,
    color: '#0A5F3C',
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 14,
    color: '#2E8B57',
  },
  contactSection: {
    padding: 20,
    backgroundColor: '#0A3622', // Very dark green background
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#E8F5E9', // Light green/white text
  },
  contactText: {
    fontSize: 16,
    color: '#A8E4BC', // Light green text
    marginBottom: 8,
  },
});