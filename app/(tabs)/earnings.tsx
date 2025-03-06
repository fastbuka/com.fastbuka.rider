import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    branch: string;
}

export default function Earnings() {
    const [modalVisible, setModalVisible] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const { user } = useAuth();

    const bankAccounts = [
        
        {
            id: '4',
            bankName: 'STELLAR WALLET (NGNC)',
            accountNumber: 'GAXXXXXXXX565',
            accountHolder: 'FASTBUKA TESTNET',
            branch: 'STELLAR TESTNET NGNC',
        },
        {
            id: '1',
            bankName: 'First Bank',
            accountNumber: '62XXXXXX789',
            accountHolder: 'John Doe',
            branch: 'Victoria Island Branch',
        },
        {
            id: '2',
            bankName: 'Guaranty Trust Bank',
            accountNumber: '45XXXXXX234',
            accountHolder: 'John Doe',
            branch: 'Lagos Mainland Branch',
        },
        {
            id: '3',
            bankName: 'Access Bank',
            accountNumber: '89XXXXXX567',
            accountHolder: 'John Doe',
            branch: 'Abuja Branch',
        }
    ];

    const earningsData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
            data: [150, 220, 180, 240, 190, 280, 200]
        }]
    };

    const handleWithdrawal = () => {
        if (!selectedAccount) {
            Alert.alert("Error", "Please select a bank account");
            return;
        }
        if (!withdrawalAmount) {
            Alert.alert("Error", "Please enter withdrawal amount");
            return;
        }
        setModalVisible(false);
        setOtpModalVisible(true);
    };

    const handleOtpConfirmation = () => {
        if (otp === '1234') { // Mock OTP validation
            Alert.alert(
                "Success",
                "Withdrawal request processed successfully",
                [{ text: "OK", onPress: () => {
                    setOtpModalVisible(false);
                    setWithdrawalAmount('');
                    setSelectedAccount(null);
                    setOtp('');
                }}]
            );
        } else {
            Alert.alert("Error", "Invalid OTP. Please try again.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Your Earnings</Text>
                <Text style={styles.totalAmount}>NGN 211,460.00</Text>
                <Text style={styles.period}>This Week</Text>
                <TouchableOpacity 
                    style={styles.withdrawButton}
                    onPress={() => setModalVisible(true)}>
                    <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Earnings Trend</Text>
                <LineChart
                    data={earningsData}
                    width={Dimensions.get('window').width - 40}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#fff',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
                        style: {
                            borderRadius: 16
                        }
                    }}
                    bezier
                    style={styles.chart}
                />
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <MaterialCommunityIcons name="car" size={24} color="green" />
                    <Text style={styles.statValue}>32</Text>
                    <Text style={styles.statLabel}>Total Rides</Text>
                </View>
                <View style={styles.statCard}>
                    <MaterialCommunityIcons name="clock-outline" size={24} color="green" />
                    <Text style={styles.statValue}>28.5</Text>
                    <Text style={styles.statLabel}>Hours Online</Text>
                </View>
                <View style={styles.statCard}>
                    <MaterialCommunityIcons name="star" size={24} color="green" />
                    <Text style={styles.statValue}>4.9</Text>
                    <Text style={styles.statLabel}>Rating</Text>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Withdraw Funds</Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Enter amount (NGN)"
                            keyboardType="numeric"
                            value={withdrawalAmount}
                            onChangeText={setWithdrawalAmount}
                        />

                        <Text style={styles.bankTitle}>Select Bank Account</Text>
                        {bankAccounts.map(account => (
                            <TouchableOpacity
                                key={account.id}
                                style={[
                                    styles.accountOption,
                                    selectedAccount?.id === account.id && styles.selectedAccount
                                ]}
                                onPress={() => setSelectedAccount(account)}>
                                <Text style={styles.bankName}>{account.bankName}</Text>
                                <Text style={styles.accountNumber}>{account.accountNumber}</Text>
                            </TouchableOpacity>
                        ))}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleWithdrawal}>
                                <Text style={styles.modalButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={otpModalVisible}
                onRequestClose={() => setOtpModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter OTP</Text>
                        <Text style={styles.otpDescription}>
                            Please enter the OTP sent to your registered phone number
                        </Text>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Enter OTP"
                            keyboardType="numeric"
                            value={otp}
                            onChangeText={setOtp}
                            maxLength={4}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setOtpModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleOtpConfirmation}>
                                <Text style={styles.modalButtonText}>Verify</Text>
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
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    totalAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'green',
        marginVertical: 10,
    },
    period: {
        fontSize: 16,
        color: '#666',
    },
    withdrawButton: {
        backgroundColor: 'green',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 10,
    },
    withdrawButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    chartContainer: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 15,
        borderRadius: 15,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    chart: {
        borderRadius: 15,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    statCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '30%',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 20,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    bankTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    accountOption: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    selectedAccount: {
        backgroundColor: '#e6ffe6',
        borderColor: 'green',
        borderWidth: 1,
    },
    bankName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    accountNumber: {
        fontSize: 14,
        color: '#666',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#ff4444',
    },
    confirmButton: {
        backgroundColor: 'green',
    },
    modalButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },
    otpDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
});