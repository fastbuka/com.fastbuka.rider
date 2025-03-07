import React, { useState, useRef, FC } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { MaskedTextInput } from 'react-native-mask-text';
import Checkbox from 'expo-checkbox';
import Signature from 'react-native-signature-canvas';
import ProgressBar from 'react-native-progress/Bar';
import { register } from '@/services/api'; // Import the register function from the API service

// Screen Dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Options
const genderOptions = ['Male', 'Female'] as const;
const idTypeOptions = ['National ID', "Driver's License", "Voter's Card"] as const;
const bankOptions = [
  'Access Bank',
  'Citibank Nigeria',
  'Ecobank Nigeria',
  'Fidelity Bank',
  'First Bank',
  'First City Monument Bank',
  'Globus Bank',
  'GTBank',
  'Heritage Bank',
  'Keystone Bank',
  'Polaris Bank',
  'Providus Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'SunTrust Bank',
  'UBA',
  'Union Bank',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
  'Other'
] as const;
const vehicleTypeOptions = ['Motorcycle', 'Bicycle', 'Car'] as const;
const workingHoursOptions = ['Full-Time', 'Part-Time', 'Weekends Only', 'Evenings Only'] as const;
const deliveryAreaOptions = ['Enugu', 'Abuja', 'Lagos', 'Port Harcourt', 'Ibadan', 'Other'] as const;
const yesNoOptions = ['Yes', 'No'] as const;
const stateOptions = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
] as const;

// ---------------------------------
//      Prop Types & Interfaces
// ---------------------------------

type ProgressIndicatorProps = {
  currentStage: number;
  totalStages: number;
};

type DropdownSelectorProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: readonly string[];
  placeholder?: string;
};

type MultiSelectDropdownProps = {
  label: string;
  selectedValues: string[];
  onChange: (vals: string[]) => void;
  options: readonly string[];
  placeholder?: string;
};

type ImageUploaderProps = {
  label: string;
  image: string | null;
  onImageSelected: (uri: string | null) => void;
};

type SignatureCaptureProps = {
  value: string | null;
  onChange: (sig: string | null) => void;
};

type StageIndicatorProps = {
  currentStage: number;
  stages: string[];
  setStage: (stage: number) => void;
};

type FormProgress = {
  stage1: boolean;
  stage2: boolean;
  stage3: boolean;
  stage4: boolean;
  stage5: boolean;
};

// ---------------------------------
//        UI Components
// ---------------------------------

const ProgressIndicator: FC<ProgressIndicatorProps> = ({ currentStage, totalStages }) => {
  return (
    <View style={styles.progressContainer}>
      <ProgressBar 
        progress={currentStage / totalStages}
        width={windowWidth - 40}
        height={10}
        color="#22c55e"
        unfilledColor="#e5e7eb"
        borderWidth={0}
        borderRadius={5}
      />
      <View style={styles.stagesTextContainer}>
        <Text style={styles.stageText}>Stage {currentStage} of {totalStages}</Text>
        <Text style={styles.stageText}>{Math.round((currentStage / totalStages) * 100)}% Complete</Text>
      </View>
    </View>
  );
};

const DropdownSelector: FC<DropdownSelectorProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity 
        style={[styles.input, styles.dropdownButton]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={value ? styles.dropdownSelectedText : styles.dropdownPlaceholderText}>
          {value || placeholder}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsContainer}>
              {options.map((option, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.optionItem,
                    value === option && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onChange(option);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === option && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                  {value === option && (
                    <Ionicons name="checkmark" size={22} color="#22c55e" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const MultiSelectDropdown: FC<MultiSelectDropdownProps> = ({
  label,
  selectedValues = [],
  onChange,
  options,
  placeholder = 'Select options',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((item) => item !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.input, styles.dropdownButton]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={
            selectedValues.length > 0
              ? styles.dropdownSelectedText
              : styles.dropdownPlaceholderText
          }
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {selectedValues.length > 0 ? selectedValues.join(', ') : placeholder}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    selectedValues.includes(option) && styles.selectedOption,
                  ]}
                  onPress={() => toggleOption(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedValues.includes(option) && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                  <Checkbox
                    value={selectedValues.includes(option)}
                    onValueChange={() => toggleOption(option)}
                    color={selectedValues.includes(option) ? '#22c55e' : undefined}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.multiSelectDoneButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.multiSelectDoneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const ImageUploader: FC<ImageUploaderProps> = ({
  label,
  image,
  onImageSelected,
}) => {
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'You need to allow access to your photos to upload an image.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      // `result` can have `canceled` property in newer versions of expo-image-picker
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const chosen: ImagePickerAsset = result.assets[0];
        onImageSelected(chosen.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while selecting an image.');
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'You need to allow access to your camera to take a photo.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const chosen: ImagePickerAsset = result.assets[0];
        onImageSelected(chosen.uri);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while taking a photo.');
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>

      {image ? (
        <View style={styles.selectedImageContainer}>
          <Image source={{ uri: image }} style={styles.selectedImage} />
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => onImageSelected(null)}
          >
            <Ionicons name="close-circle" size={26} color="#ef4444" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.uploadButtonsContainer}>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Ionicons
              name="images-outline"
              size={24}
              color="#fff"
              style={styles.uploadButtonIcon}
            />
            <Text style={styles.uploadButtonText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
            <Ionicons
              name="camera-outline"
              size={24}
              color="#fff"
              style={styles.uploadButtonIcon}
            />
            <Text style={styles.uploadButtonText}>Camera</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const SignatureCapture: FC<SignatureCaptureProps> = ({ value, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignature = (signature: string) => {
    onChange(signature);
    setModalVisible(false);
  };

  const handleClear = () => {
    onChange(null);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Signature (Draw or Type)</Text>

      {value ? (
        <View style={styles.signaturePreviewContainer}>
          <Image
            source={{ uri: value }}
            style={styles.signaturePreview}
            resizeMode="contain"
          />
          <View style={styles.signatureButtonsContainer}>
            <TouchableOpacity
              style={styles.signatureButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.signatureButtonText}>Redraw</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.signatureButton, styles.signatureClearButton]}
              onPress={handleClear}
            >
              <Text style={styles.signatureClearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.signatureEmptyContainer}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome5 name="signature" size={24} color="#666" />
          <Text style={styles.signatureEmptyText}>Tap to sign</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.signatureModalOverlay}>
          <View style={styles.signatureModalContent}>
            <View style={styles.signatureModalHeader}>
              <Text style={styles.signatureModalHeaderText}>Sign Here</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.signatureCanvasContainer}>
              <Signature
                onOK={handleSignature}
                descriptionText="Sign above"
                clearText="Clear"
                confirmText="Save"
                webStyle={`.m-signature-pad--footer
                  .button {
                    background-color: #22c55e;
                    color: #fff;
                    padding: 10px 20px;
                    border-radius: 5px;
                    margin: 0 10px;
                  }
                  .m-signature-pad--footer
                  .button.clear {
                    background-color: #f3f4f6;
                    color: #333;
                  }
                `}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const StageIndicator: FC<StageIndicatorProps> = ({ currentStage, stages, setStage }) => {
  return (
    <View style={styles.stageIndicatorContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stages.map((stageName, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.stageIndicator,
              currentStage === index + 1 && styles.activeStageIndicator,
              currentStage > index + 1 && styles.completedStageIndicator,
            ]}
            onPress={() => {
              // Only allow navigating to stages already reached
              if (index + 1 <= currentStage) {
                setStage(index + 1);
              }
            }}
          >
            {currentStage > index + 1 ? (
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
            ) : (
              <Text
                style={[
                  styles.stageIndicatorText,
                  (currentStage === index + 1 || currentStage > index + 1) &&
                    styles.activeStageIndicatorText,
                ]}
              >
                {index + 1}
              </Text>
            )}

            <Text
              style={[
                styles.stageIndicatorLabel,
                (currentStage === index + 1 || currentStage > index + 1) &&
                  styles.activeStageIndicatorLabel,
              ]}
              numberOfLines={1}
            >
              {stageName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// ---------------------------------
//     Main FastBukaSignup Form
// ---------------------------------

const FastBukaSignup: FC = () => {
  const router = useRouter();
  const scrollRef = useRef<ScrollView | null>(null);

  const stages: string[] = [
    'Personal Information',
    'Identification',
    'Vehicle Details',
    'Work Preferences',
    'Agreement',
  ];

  const [stage, setStage] = useState<number>(1);

  const [formProgress, setFormProgress] = useState<FormProgress>({
    stage1: false,
    stage2: false,
    stage3: false,
    stage4: false,
    stage5: false,
  });

  // ----------------------
  //  Stage 1: Personal
  // ----------------------
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [birthday, setBirthday] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [gender, setGender] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [homeAddress, setHomeAddress] = useState<string>('');
  const [residence, setResidence] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');

  // ---------------------------
  // Stage 2: Identification
  // ---------------------------
  const [idType, setIdType] = useState<string>('');
  const [idImage, setIdImage] = useState<string | null>(null);
  const [passportPhoto, setPassportPhoto] = useState<string | null>(null);
  const [bankName, setBankName] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');

  // ----------------------------
  // Stage 3: Vehicle & Equipment
  // ----------------------------
  const [vehicleType, setVehicleType] = useState<string>('');
  const [vehicleRegNumber, setVehicleRegNumber] = useState<string>('');
  const [vehicleOwnership, setVehicleOwnership] = useState<string>('');
  const [vehicleOwnerContact, setVehicleOwnerContact] = useState<string>('');
  const [vehiclePhoto, setVehiclePhoto] = useState<string | null>(null);

  // ------------------------
  // Stage 4: Work Preferences
  // ------------------------
  const [workingHours, setWorkingHours] = useState<string>('');
  const [deliveryAreas, setDeliveryAreas] = useState<string[]>([]);
  const [experience, setExperience] = useState<string>('');
  const [previousCompanies, setPreviousCompanies] = useState<string>('');

  // ---------------------------
  // Stage 5: Agreement & Dec
  // ---------------------------
  const [infoAccurate, setInfoAccurate] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [understandApproval, setUnderstandApproval] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [date, setDate] = useState<string>(new Date().toLocaleDateString());

  // -----------
  //  Errors
  // -----------
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Date picker
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const validateStage = () => {
    const newErrors: Record<string, string> = {};

    if (stage === 1) {
      if (!firstName.trim()) newErrors.firstName = 'First name is required';
      if (!lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!gender) newErrors.gender = 'Please select your gender';
      if (!phoneNumber) newErrors.phoneNumber = 'Phone number is required';
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!homeAddress.trim()) newErrors.homeAddress = 'Home address is required';
      if (!residence) newErrors.residence = 'Please select your state/city of residence';
      if (!emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    }

    if (stage === 2) {
      if (!idType) newErrors.idType = 'Please select an ID type';
      if (!idImage) newErrors.idImage = 'Please upload a copy of your ID';
      if (!passportPhoto) newErrors.passportPhoto = 'Please upload a passport photo';
      if (!bankName) newErrors.bankName = 'Please select a bank name';
      if (!accountName.trim()) newErrors.accountName = 'Account name is required';
      if (!accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required';
      } else if (!/^\d{10}$/.test(accountNumber)) {
        newErrors.accountNumber = 'Account number must be 10 digits';
      }
    }

    if (stage === 3) {
      if (!vehicleType) newErrors.vehicleType = 'Please select vehicle type';
      if (!vehicleRegNumber.trim()) newErrors.vehicleRegNumber = 'Vehicle registration number is required';
      if (!vehicleOwnership) newErrors.vehicleOwnership = 'Please specify if you own this vehicle';
      if (vehicleOwnership === 'No' && !vehicleOwnerContact.trim()) {
        newErrors.vehicleOwnerContact = "Owner's contact information is required";
      }
      if (!vehiclePhoto) newErrors.vehiclePhoto = 'Please upload a photo of your vehicle';
    }

    if (stage === 4) {
      if (!workingHours) newErrors.workingHours = 'Please select your preferred working hours';
      if (deliveryAreas.length === 0) newErrors.deliveryAreas = 'Please select at least one delivery area';
      if (!experience) newErrors.experience = 'Please specify if you have previous experience';
      if (experience === 'Yes' && !previousCompanies.trim()) {
        newErrors.previousCompanies = "Please list companies you've worked with";
      }
    }

    if (stage === 5) {
      if (!infoAccurate) newErrors.infoAccurate = 'You must confirm the information is accurate';
      if (!agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions';
      if (!understandApproval) newErrors.understandApproval = 'You must acknowledge this requirement';
      if (!signature) newErrors.signature = 'Please provide your signature';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStage = () => {
    if (validateStage()) {
      setFormProgress({
        ...formProgress,
        [`stage${stage}`]: true,
      } as FormProgress);

      if (stage < stages.length) {
        setStage(stage + 1);
        scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      }
    }
  };

  const prevStage = () => {
    if (stage > 1) {
      setStage(stage - 1);
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const handleSubmit = async () => {
    if (validateStage()) {
      try {
        // Construct user data
        const userData = {
          personalInfo: {
            firstName,
            lastName,
            birthday: birthday.toISOString(),
            gender,
            phoneNumber,
            email,
            homeAddress,
            residence,
            emergencyContact,
          },
          identification: {
            idType,
            idImage,
            passportPhoto,
            bankDetails: {
              bankName,
              accountName,
              accountNumber,
            },
          },
          vehicleDetails: {
            vehicleType,
            vehicleRegNumber,
            vehicleOwnership,
            vehicleOwnerContact:
              vehicleOwnership === 'No' ? vehicleOwnerContact : '',
            vehiclePhoto,
          },
          workPreferences: {
            workingHours,
            deliveryAreas,
            experience,
            previousCompanies: experience === 'Yes' ? previousCompanies : '',
          },
          agreement: {
            infoAccurate,
            agreeTerms,
            understandApproval,
            signature,
            date,
          },
        };

        // Submit data to API
        await register(userData);

        Alert.alert('Application Submitted!', 'Your application is under review. We will contact you soon!', [
          {
            text: 'OK',
            onPress: () => router.replace('/login'),
          },
        ]);
      } catch (error) {
        Alert.alert('Submission Failed', 'There was an error submitting your application. Please try again.', [
          { text: 'OK' },
        ]);
      }
    }
  };

  const renderStageContent = () => {
    switch (stage) {
      case 1:
        return (
          <View style={styles.stageContent}>
            <Text style={styles.stageTitle}>
              <FontAwesome5 name="user-alt" size={20} color="#22c55e" /> Personal Information
            </Text>

            <View style={styles.nameRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={[styles.input, errors.firstName && styles.inputError]}
                  placeholder="John"
                  value={firstName}
                  onChangeText={setFirstName}
                />
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
              </View>

              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={[styles.input, errors.lastName && styles.inputError]}
                  placeholder="Doe"
                  value={lastName}
                  onChangeText={setLastName}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth (DD/MM/YYYY)</Text>
              <TouchableOpacity
                style={[styles.input, styles.datePickerButton]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.datePickerText}>{birthday.toLocaleDateString()}</Text>
                <MaterialIcons name="calendar-today" size={20} color="#666" />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={birthday}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)}
                />
              )}
            </View>

            <DropdownSelector
              label="Gender"
              value={gender}
              onChange={setGender}
              options={genderOptions}
              placeholder="Select gender"
            />
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number (with Country Code)</Text>
              <MaskedTextInput
                mask="+999 999 999 9999"
                style={[styles.input, errors.phoneNumber && styles.inputError]}
                placeholder="+234 800 123 4567"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="example@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Home Address</Text>
              <TextInput
                style={[styles.input, errors.homeAddress && styles.inputError]}
                placeholder="Street, City, State"
                value={homeAddress}
                onChangeText={setHomeAddress}
                multiline
              />
              {errors.homeAddress && <Text style={styles.errorText}>{errors.homeAddress}</Text>}
            </View>

            <DropdownSelector
              label="State/City of Residence"
              value={residence}
              onChange={setResidence}
              options={stateOptions}
              placeholder="Select state"
            />
            {errors.residence && <Text style={styles.errorText}>{errors.residence}</Text>}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Emergency Contact Name & Phone Number</Text>
              <TextInput
                style={[styles.input, errors.emergencyContact && styles.inputError]}
                placeholder="Jane Doe, +234 800 987 6543"
                value={emergencyContact}
                onChangeText={setEmergencyContact}
              />
              {errors.emergencyContact && <Text style={styles.errorText}>{errors.emergencyContact}</Text>}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stageContent}>
            <Text style={styles.stageTitle}>
              <Ionicons name="card-outline" size={22} color="#22c55e" /> Identification & Verification
            </Text>

            <DropdownSelector
              label="Select ID Type"
              value={idType}
              onChange={setIdType}
              options={idTypeOptions}
              placeholder="Select ID type"
            />
            {errors.idType && <Text style={styles.errorText}>{errors.idType}</Text>}

            <ImageUploader
              label="Upload a Clear Copy of Your ID"
              image={idImage}
              onImageSelected={setIdImage}
            />
            {errors.idImage && <Text style={styles.errorText}>{errors.idImage}</Text>}

            <ImageUploader
              label="Upload a Recent Passport Photo"
              image={passportPhoto}
              onImageSelected={setPassportPhoto}
            />
            {errors.passportPhoto && <Text style={styles.errorText}>{errors.passportPhoto}</Text>}

            <Text style={styles.sectionSubtitle}>Bank Account Details for Payments</Text>

            <DropdownSelector
              label="Bank Name"
              value={bankName}
              onChange={setBankName}
              options={bankOptions}
              placeholder="Select bank"
            />
            {errors.bankName && <Text style={styles.errorText}>{errors.bankName}</Text>}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Account Name</Text>
              <TextInput
                style={[styles.input, errors.accountName && styles.inputError]}
                placeholder="John Doe"
                value={accountName}
                onChangeText={setAccountName}
              />
              {errors.accountName && <Text style={styles.errorText}>{errors.accountName}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Account Number</Text>
              <TextInput
                style={[styles.input, errors.accountNumber && styles.inputError]}
                placeholder="1234567890"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
              />
              {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stageContent}>
            <Text style={styles.stageTitle}>
              <FontAwesome5 name="car" size={20} color="#22c55e" /> Vehicle & Equipment Details
            </Text>

            <DropdownSelector
              label="Type of Vehicle"
              value={vehicleType}
              onChange={setVehicleType}
              options={vehicleTypeOptions}
              placeholder="Select vehicle type"
            />
            {errors.vehicleType && <Text style={styles.errorText}>{errors.vehicleType}</Text>}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Vehicle Registration Number</Text>
              <TextInput
                style={[styles.input, errors.vehicleRegNumber && styles.inputError]}
                placeholder="ABC-1234"
                value={vehicleRegNumber}
                onChangeText={setVehicleRegNumber}
              />
              {errors.vehicleRegNumber && <Text style={styles.errorText}>{errors.vehicleRegNumber}</Text>}
            </View>

            <DropdownSelector
              label="Do You Own This Vehicle?"
              value={vehicleOwnership}
              onChange={setVehicleOwnership}
              options={yesNoOptions}
              placeholder="Select Yes or No"
            />
            {errors.vehicleOwnership && <Text style={styles.errorText}>{errors.vehicleOwnership}</Text>}

            {vehicleOwnership === 'No' && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Owner's Name & Contact</Text>
                <TextInput
                  style={[styles.input, errors.vehicleOwnerContact && styles.inputError]}
                  placeholder="Owner's Name, +CountryCode Phone"
                  value={vehicleOwnerContact}
                  onChangeText={setVehicleOwnerContact}
                />
                {errors.vehicleOwnerContact && (
                  <Text style={styles.errorText}>{errors.vehicleOwnerContact}</Text>
                )}
              </View>
            )}

            <ImageUploader
              label="Upload a Photo of Your Vehicle"
              image={vehiclePhoto}
              onImageSelected={setVehiclePhoto}
            />
            {errors.vehiclePhoto && <Text style={styles.errorText}>{errors.vehiclePhoto}</Text>}
          </View>
        );

      case 4:
        return (
          <View style={styles.stageContent}>
            <Text style={styles.stageTitle}>
              <Ionicons name="briefcase-outline" size={22} color="#22c55e" /> Work Preferences
            </Text>

            <DropdownSelector
              label="Preferred Working Hours"
              value={workingHours}
              onChange={setWorkingHours}
              options={workingHoursOptions}
              placeholder="Select working hours"
            />
            {errors.workingHours && <Text style={styles.errorText}>{errors.workingHours}</Text>}

            <MultiSelectDropdown
              label="Preferred Delivery Areas"
              selectedValues={deliveryAreas}
              onChange={setDeliveryAreas}
              options={deliveryAreaOptions}
              placeholder="Select delivery areas"
            />
            {errors.deliveryAreas && <Text style={styles.errorText}>{errors.deliveryAreas}</Text>}

            <DropdownSelector
              label="Do You Have Previous Delivery Experience?"
              value={experience}
              onChange={setExperience}
              options={yesNoOptions}
              placeholder="Yes or No"
            />
            {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}

            {experience === 'Yes' && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>List Companies You've Worked With</Text>
                <TextInput
                  style={[styles.input, errors.previousCompanies && styles.inputError]}
                  placeholder="Company A, Company B, ..."
                  value={previousCompanies}
                  onChangeText={setPreviousCompanies}
                  multiline
                />
                {errors.previousCompanies && (
                  <Text style={styles.errorText}>{errors.previousCompanies}</Text>
                )}
              </View>
            )}
          </View>
        );

      case 5:
        return (
          <View style={styles.stageContent}>
            <Text style={styles.stageTitle}>
              <Ionicons name="checkmark-done-circle-outline" size={22} color="#22c55e" />{' '}
              Agreement & Declaration
            </Text>

            <View style={styles.checkboxContainer}>
              <Checkbox
                value={infoAccurate}
                onValueChange={setInfoAccurate}
                color={infoAccurate ? '#22c55e' : undefined}
              />
              <Text style={styles.checkboxLabel}>
                I confirm that the information provided is true and accurate.
              </Text>
            </View>
            {errors.infoAccurate && <Text style={styles.errorText}>{errors.infoAccurate}</Text>}

            <View style={styles.checkboxContainer}>
              <Checkbox
                value={agreeTerms}
                onValueChange={setAgreeTerms}
                color={agreeTerms ? '#22c55e' : undefined}
              />
              <Text style={styles.checkboxLabel}>I agree to abide by FastBuka’s Rider Terms & Conditions.</Text>
            </View>
            {errors.agreeTerms && <Text style={styles.errorText}>{errors.agreeTerms}</Text>}

            <View style={styles.checkboxContainer}>
              <Checkbox
                value={understandApproval}
                onValueChange={setUnderstandApproval}
                color={understandApproval ? '#22c55e' : undefined}
              />
              <Text style={styles.checkboxLabel}>
                I understand that FastBuka reserves the right to approve or reject my application.
              </Text>
            </View>
            {errors.understandApproval && (
              <Text style={styles.errorText}>{errors.understandApproval}</Text>
            )}

            <SignatureCapture value={signature} onChange={setSignature} />
            {errors.signature && <Text style={styles.errorText}>{errors.signature}</Text>}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date</Text>
              <TextInput style={styles.input} value={date} editable={false} />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContainer}>
          <StageIndicator currentStage={stage} stages={stages} setStage={setStage} />
          <ProgressIndicator currentStage={stage} totalStages={stages.length} />
          {renderStageContent()}

          <View style={styles.navigationButtonsContainer}>
            {stage > 1 && (
              <TouchableOpacity style={styles.navButton} onPress={prevStage}>
                <Text style={styles.navButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            {stage < stages.length ? (
              <TouchableOpacity style={styles.navButton} onPress={nextStage}>
                <Text style={styles.navButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit Application</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FastBukaSignup;

// ---------------------------------
//            STYLES
// ---------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  stagesTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth - 40,
    marginTop: 5,
  },
  stageText: {
    fontSize: 12,
    color: '#555',
  },
  inputContainer: {
    marginVertical: 8,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 2,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownSelectedText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownPlaceholderText: {
    fontSize: 14,
    color: '#aaa',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    maxHeight: windowHeight * 0.6,
    padding: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginBottom: 10,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOption: {
    backgroundColor: '#e0f2f1',
  },
  selectedOptionText: {
    color: '#22c55e',
  },
  multiSelectDoneButton: {
    alignSelf: 'center',
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  multiSelectDoneButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedImageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    padding: 10,
    borderRadius: 5,
    flex: 0.48,
    justifyContent: 'center',
  },
  uploadButtonIcon: {
    marginRight: 5,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  signaturePreviewContainer: {
    alignItems: 'center',
  },
  signaturePreview: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  signatureButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    width: '100%',
  },
  signatureButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  signatureButtonText: {
    color: '#fff',
  },
  signatureClearButton: {
    backgroundColor: '#f87171',
  },
  signatureClearButtonText: {
    color: '#fff',
  },
  signatureEmptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    justifyContent: 'center',
  },
  signatureEmptyText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  signatureModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
  },
  signatureModalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    maxHeight: windowHeight * 0.8,
    padding: 15,
  },
  signatureModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  signatureModalHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  signatureCanvasContainer: {
    flex: 1,
  },
  stageIndicatorContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stageIndicator: {
    alignItems: 'center',
    marginRight: 15,
  },
  activeStageIndicator: {
    backgroundColor: '#22c55e',
    borderRadius: 20,
    padding: 5,
  },
  completedStageIndicator: {
    backgroundColor: '#22c55e',
    borderRadius: 20,
    padding: 5,
  },
  stageIndicatorText: {
    fontSize: 14,
    color: '#333',
  },
  activeStageIndicatorText: {
    color: '#fff',
  },
  stageIndicatorLabel: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  activeStageIndicatorLabel: {
    color: '#22c55e',
  },
  stageContent: {
    marginBottom: 20,
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#22c55e',
  },
  nameRow: {
    flexDirection: 'row',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  navButton: {
    backgroundColor: '#22c55e',
    padding: 15,
    borderRadius: 5,
    flex: 0.45,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
});
