import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Platform, ScrollView, LogBox, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import PrivacyPolicy from '@/app/(tabs)/profile/privacy-policy';

LogBox.ignoreLogs([
  'Warning: CountryModal:',
  'Warning: Main:',
  'Warning: FlagButton:',
  'Warning: Flag:',
  'Warning: CountryItem:',
]);

interface PhoneInputFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

const PhoneInputField = ({ value, onChangeText, error }: PhoneInputFieldProps) => {
  const [countryCode, setCountryCode] = useState<CountryCode>('NG');
  const [callingCode, setCallingCode] = useState('234');
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  return (
    <View style={styles.phoneContainer}>
      <TouchableOpacity 
        style={styles.countryCode}
        onPress={() => setShowCountryPicker(true)}
      >
        <CountryPicker
          withFilter
          withFlag
          withCallingCode
          withEmoji={false}
          withAlphaFilter
          withCallingCodeButton={false}
          countryCode={countryCode}
          visible={showCountryPicker}
          onClose={() => setShowCountryPicker(false)}
          onSelect={(country) => {
            setCountryCode(country.cca2);
            setCallingCode(country.callingCode[0]);
            setShowCountryPicker(false);
          }}
          containerButtonStyle={styles.countryPickerButton}
        />
        <Text style={styles.countryCodeText}>+{callingCode}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.phoneInput}
        value={value}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, '');
          onChangeText(numericValue);
        }}
        keyboardType="phone-pad"
        placeholder="Phone number"
        maxLength={11}
      />
    </View>
  );
};

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const router = useRouter();

  const screenHeight = Dimensions.get('window').height;

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation
    if (!phoneNumber || phoneNumber.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    // Password validation
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.password = 'Passwords do not match';
      isValid = false;
    }

    // Name validation
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = () => {
    if (validateForm()) {
      // Proceed with signup
      console.log('Form is valid, proceeding with signup');
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPrivacyPolicy}
        onRequestClose={() => setShowPrivacyPolicy(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowPrivacyPolicy(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <PrivacyPolicy />
          </View>
        </View>
      </Modal>

      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/logo.png')}
          style={[styles.logo, { height: screenHeight * 0.1 }]}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.headerText}>Hello!!</Text>
      <Text style={styles.subText}>
        Sign up or log in now to start ordering and enjoy quick, reliable service at your convenience!
      </Text>

      <Text style={styles.label}>Create an account!</Text>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.nameContainer}>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g John"
              value={firstName}
              onChangeText={setFirstName}
            />
            {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
          </View>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g Doe"
              value={lastName}
              onChangeText={setLastName}
            />
            {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <PhoneInputField
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            error={errors.phone}
          />
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Birthday</Text>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerText}>
              {birthday.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>Get free delivery and discounts on your birthday</Text>
          {showDatePicker && (
            <DateTimePicker
              value={birthday}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setBirthday(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Referral Code (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter referral code"
            value={referralCode}
            onChangeText={setReferralCode}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={[styles.input, { paddingRight: 50 }]}
              placeholder="Enter Password"
              placeholderTextColor="#ccc"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={[styles.input, { paddingRight: 50 }]}
              placeholder="Enter Password"
              placeholderTextColor="#ccc"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!confirmPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={confirmPasswordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowPrivacyPolicy(true)}>
          <Text style={styles.privacyText}>
            By signing up, you agree to our <Text style={styles.privacyLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={styles.loginContainer}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink}>Sign in</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity>
            <Image source={require('@/assets/icons/google.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('@/assets/icons/apple.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('@/assets/icons/facebook.png')} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  label: {
    fontSize: 20,
    fontFamily: 'Fustat-Bold',
    color: '#22c55e',
    marginBottom: 20,
  },
   scrollContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 30,
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
  passwordInputWrapper: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 13,
  },
  signUpButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Fustat-Bold',
    textAlign: 'center',
  },
  loginContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Fustat-Regular',
  },
  loginLink: {
    color: '#22c55e',
    fontFamily: 'Fustat-Bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
    fontFamily: 'Fustat-Medium',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
  nameContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    height: 50,
    overflow: 'hidden',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    height: '100%',
  },
  countryPickerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Fustat-Regular',
    marginLeft: 5,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Fustat-Regular',
  },
  datePickerButton: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  datePickerText: {
    fontSize: 16,
    fontFamily: 'Fustat-Regular',
    color: '#333',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontFamily: 'Fustat-Regular',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Fustat-Regular',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  privacyText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
    fontSize: 14,
    fontFamily: 'Fustat-Regular',
  },
  privacyLink: {
    color: '#22c55e',
    fontFamily: 'Fustat-Bold',
  },
});

export default Signup;
