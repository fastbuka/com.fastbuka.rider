import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const router = useRouter();
  const { signIn } = useAuth();

  const screenHeight = Dimensions.get('window').height;

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else {
      newErrors.password = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignIn = async () => {
    if (validateForm()) {
      try {
        await signIn(email, password);
        router.replace('/(tabs)');
      } catch (error) {
        Alert.alert('Login Failed', 'Please check your credentials and try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/logo.png')}
          style={[styles.logo, { height: screenHeight * 0.1 }]}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.headerText}>Welcome to FastBuka Rider app</Text>
      <Text style={styles.subText}>
        Sign in now to start ordering and enjoy quick, reliable service at your convenience!
      </Text>

      <Text style={styles.label}>Sign in</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : null]}
          placeholder="Enter Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) {
              setErrors({...errors, email: ''});
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.passwordInputWrapper}>
          <TextInput
            style={[styles.input, { paddingRight: 50 }, errors.password ? styles.inputError : null]}
            placeholder="Enter Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors({...errors, password: ''});
              }
            }}
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
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      </View>

      <TouchableOpacity
        onPress={() => router.push('/forgot-password')}
        style={styles.forgotPasswordContainer}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.signInButton}
        onPress={handleSignIn}
      >
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/signup')}
        style={styles.signupContainer}
      >
        <Text style={styles.signupText}>
          Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
        </Text>
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
    fontSize: 32,
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
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Fustat-Regular',
  },
  passwordInputWrapper: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 13,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 5,
  },
  forgotPasswordText: {
    color: '#22c55e',
    fontSize: 14,
    fontFamily: 'Fustat-Medium',
  },
  signInButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Fustat-Bold',
    textAlign: 'center',
  },
  signupContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Fustat-Regular',
  },
  signupLink: {
    color: '#22c55e',
    fontFamily: 'Fustat-Bold',
  },
});

export default Login;
