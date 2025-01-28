import { ScrollView, StyleSheet, Text, View } from 'react-native';

// Privacy Policy content in JSON format
const privacyPolicyData = {
  lastUpdated: "2024-03-20",
  sections: [
    {
      title: "1. Information We Collect",
      content: [
        "Personal Information:",
        "• Full name and contact details",
        "• Delivery addresses and preferences", 
        "• Phone numbers and email addresses",
        "• Payment information (processed securely through our payment partners)",
        "• Food preferences and dietary restrictions",
        "• Order history and favorite items",
        
        "Usage Information:",
        "• Device information and IP addresses",
        "• App usage statistics and preferences",
        "• Order patterns and delivery timing preferences",
        "• Location data (with your permission for delivery tracking)",
        "• Restaurant and menu browsing history"
      ]
    },
    {
      title: "2. How We Use Your Information",
      content: [
        "We use your information to:",
        "• Process and deliver your food orders",
        "• Provide real-time delivery tracking",
        "• Customize menu recommendations",
        "• Manage your loyalty rewards",
        "• Send order confirmations and delivery updates",
        "• Improve our food and delivery services",
        "• Provide customer support",
        "• Detect and prevent fraud",
        "• Comply with food safety and delivery regulations"
      ]
    },
    {
      title: "3. Data Sharing and Disclosure",
      content: [
        "We may share your information with:",
        "• Delivery partners (to fulfill your food orders)",
        "• Restaurant partners (to prepare your orders)",
        "• Payment processors (for transaction processing)",
        "• Service providers (analytics, customer support)",
        "• Law enforcement (when legally required)",
        
        "We DO NOT:",
        "• Sell your personal information",
        "• Share data with unauthorized third parties",
        "• Use your data for unauthorized marketing"
      ]
    },
    {
      title: "4. Your Rights and Choices",
      content: [
        "You have the right to:",
        "• Access your personal information",
        "• Correct inaccurate data",
        "• Request data deletion",
        "• Opt out of marketing communications",
        "• Control app permissions (location, notifications)",
        "• Manage delivery preferences",
        "• Export your order history",
        "• Lodge a complaint with authorities"
      ]
    },
    {
      title: "5. Data Security",
      content: [
        "We protect your data through:",
        "• Encryption in transit and at rest",
        "• Regular security assessments",
        "• Secure payment processing",
        "• Access controls and authentication",
        "• Secure data storage practices",
        "• Regular security updates",
        "• Employee training on food safety and data protection"
      ]
    },
    {
      title: "6. Children's Privacy",
      content: [
        "• Our service is not intended for users under 13",
        "• We do not knowingly collect data from children",
        "• Parents can request data deletion",
        "• We comply with children's privacy protection laws"
      ]
    },
    {
      title: "7. International Data Transfers",
      content: [
        "• Data may be processed in different African countries",
        "• We ensure appropriate safeguards",
        "• We comply with international data protection laws",
        "• We maintain data transfer agreements"
      ]
    },
    {
      title: "8. Changes to Privacy Policy",
      content: [
        "• We may update this policy periodically",
        "• Users will be notified of significant changes",
        "• Continued use implies acceptance",
        "• Previous versions will be archived"
      ]
    },
    {
      title: "9. Contact Information",
      content: [
        "For privacy-related inquiries:",
        "• Email: support@fastbuka.com",
        "• Website: www.fastbuka.com",
        "• Phone: +260-977-123456",
        "• Address: Plot 123, Great East Road, Delta State, Nigeria",
        "Response time: Within 24-48 hours"
      ]
    }
  ]
};

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>FastBuka Privacy Policy</Text>
        <Text style={styles.lastUpdated}>
          Last Updated: {privacyPolicyData.lastUpdated}
        </Text>
      </View>

      {privacyPolicyData.sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.content.map((item, itemIndex) => (
            <Text key={itemIndex} style={styles.contentText}>
              {item}
            </Text>
          ))}
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          If you have any questions about this Privacy Policy, please contact FastBuka customer support.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  contentContainer: {
    paddingBottom: 100, // Add padding at bottom to account for tab bar
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#A8E4BC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A5F3C',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#2E8B57',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#A8E4BC',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A5F3C',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    color: '#2E8B57',
    marginBottom: 8,
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    backgroundColor: '#A8E4BC',
  },
  footerText: {
    fontSize: 14,
    color: '#0A5F3C',
    textAlign: 'center',
  },
});