import React, { useState } from 'react';
import { StyleSheet, View, Image, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Background from '../Components/BackGround';
import { API_URL } from '../Utils/confing'

const Payment = ({ navigation }) => {
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentPlace, setPaymentPlace] = useState('');

    const createPayment = async () => {
        // Fetch groupId from AsyncStorage
        const groupId = await AsyncStorage.getItem('selectedGroupId');

        // Check if groupId is available
        if (groupId) {
            const paymentData = {
                price: parseFloat(paymentAmount),
                place: paymentPlace,
            };

            try {
                // Make a POST request to create a new payment
                const response = await axios.post(`${API_URL}/payments/${groupId}`, paymentData);

                // Check if the payment was successful based on the isPaySuccess property in the response data
                if (response.data.paySuccess) {
                    Alert.alert('Success', 'Payment created successfully', [
                        { text: 'OK', onPress: () => navigation.navigate('Group') },
                    ]);
                    // You can navigate to another screen or perform any other action as needed
                } else {
                    // Handle other error cases
                    console.log(response.data); // Log the detailed response data for debugging
                }
            } catch (error) {
                // Handle general errors
                if (error.response.status === 500) {
                    Alert.alert('Error', error.response.data, [
                        { text: 'OK', onPress: () => navigation.navigate('Group') },
                    ]);
                } else {
                    console.error(error);
                }
            }

        } else {
            Alert.alert('Error', 'Group ID not found');
        }
    };


    return (
        <Background>
            <View style={styles.container}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Payment Amount:</Text>
                    <TextInput
                        style={styles.input}
                        value={paymentAmount}
                        onChangeText={(text) => setPaymentAmount(text)}
                        placeholder="Enter amount"
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Payment Place:</Text>
                    <TextInput
                        style={styles.input}
                        value={paymentPlace}
                        onChangeText={(text) => setPaymentPlace(text)}
                        placeholder="Enter place"
                    />

                    <TouchableOpacity style={styles.createPaymentBtn} onPress={createPayment}>
                        <Text style={styles.buttonText}>Make Payment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Background>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
    },
    logo: {
        width: 120,
        height: 120,
        top: 20,
        left: 20,
    },
    inputContainer: {
        marginTop: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
        color: 'black',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        color: 'black',
    },
    createPaymentBtn: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginTop: 30,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 5, // Add elevation for a subtle shadow effect (Android)
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'Avenir-HeavyOblique', // Added fontFamily
    },
});

export default Payment;