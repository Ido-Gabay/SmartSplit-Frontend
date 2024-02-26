import React, { useState, useEffect } from "react";
import { StyleSheet, Text, Image, View, ImageBackground, TouchableOpacity } from 'react-native';
import Background from "../Components/BackGround";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BASE_URL = 'http://localhost:8080';

const CustomButton = ({ onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.button,
        isPressed ? styles.buttonPressed : null
      ]}
      onPress={() => {
        setIsPressed(true);
        onPress();
      }}
      onPressOut={() => setIsPressed(false)}
    >
      <Text style={styles.buttonText}>Smart Pay!</Text>
    </TouchableOpacity>
  );
};

const Group = () => {
  const [group, setGroup] = useState(null);
  const [payments, setPayments] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch data when the component mounts or when it's focused
    const fetchData = async () => {
      await getSelectedGroup();
      await getPaymentsForGroup();
    };

    const focusListener = navigation.addListener('focus', () => {
      fetchData();
    });

    fetchData(); // Fetch data when the component mounts

    // Clean up the listener when the component is unmounted
    return () => {
      focusListener();
    };
  }, [navigation]); // Dependency on navigation to re-fetch data when focused

  const getSelectedGroup = async () => {
    try {
      const selectedGroupId = await AsyncStorage.getItem('selectedGroupId');

      if (selectedGroupId) {
        const response = await axios.get(`${BASE_URL}/groups/${selectedGroupId}`);
        setGroup(response.data);
      } else {
        console.error("Selected group ID not found in AsyncStorage");
      }
    } catch (error) {
      console.error('Error fetching selected group details:', error);
    }
  };

  const getPaymentsForGroup = async () => {
    try {
      const selectedGroupId = await AsyncStorage.getItem('selectedGroupId');

      if (selectedGroupId) {
        const response = await axios.get(`${BASE_URL}/payments/group/${selectedGroupId}`);
        setPayments(response.data);
      } else {
        console.error("Selected group ID not found in AsyncStorage");
      }
    } catch (error) {
      console.error('Error fetching payments for the selected group:', error);
    }
  };

  const handleSplitPay = () => {
    navigation.navigate('Payment');
  };

  return (
    <Background>
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 120, height: 120, top: 35, left: 20 }}
      />
      <View style={styles.cardContainer}>
        <ImageBackground
          source={require('../../assets/card-background.jpg')}
          style={styles.cardImage}
        >
          <Image
            source={require('../../assets/chip.png')}
            style={styles.chipImage}
          />
          {/* Add other card details if needed */}
        </ImageBackground>
      </View>
      <View style={styles.container}>
        {group ? (
          <View>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.openDate}>{group.openDate}</Text>
            <Text style={styles.purpose}>{group.purpose}</Text>
            <Text style={styles.moneyAmount}>{`${group.moneyAmount} ₪`}</Text>
            {/* Add more details as needed */}
          </View>
        ) : (
          <Text>No group details available.</Text>
        )}

        <CustomButton onPress={handleSplitPay} />

        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Payments</Text>
          {payments.map((payment) => (
            <PaymentItem key={payment.id} payment={payment} />
          ))}
        </View>
      </View>
    </Background>
  );
};

const PaymentItem = ({ payment }) => {
  return (
    <View style={styles.paymentItem}>
      <Text>{`Price: ${payment.price} ₪`}</Text>
      <Text>{`Place: ${payment.place}`}</Text>
      {/* Add more details as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
    },
    groupName: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Avenir-HeavyOblique',
        bottom: 180,
        left: 10,
        color: 'white'
    },
    openDate: {
        fontSize: 18,
        position: 'absolute',
        bottom: 280,
        right:10,
        fontFamily: 'Avenir-HeavyOblique',
        opacity: 0.8,
        color: 'white'
    },
    purpose: {
        fontSize: 18,
        marginBottom: 10,
        fontFamily: 'Avenir-HeavyOblique',
        opacity: 0.8,
        color: 'white',
        bottom: 80,
        left:20,
    },
    moneyAmount: {
        fontSize: 35,
        alignSelf: 'center',
        fontWeight: 'bold',
        fontFamily: 'Avenir-HeavyOblique',
        color: 'white',
        bottom: 200
    },
    cardContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    cardImage: {
        width: 390,
        height: 200, // Adjust the height as needed
        borderRadius: 10, // Adjust the border radius as needed
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        top: 30,
    },
    chipImage: {
        width: 60,
        height: 40,
        position: 'absolute',
        top: 70,
        left: 20,
        borderRadius: 5,
    },
    button: {
        width: 130,
        height: 40,
        backgroundColor: 'rgb(15, 15, 15)',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '600',
        shadowRadius: 10,
        bottom : 180,
        left: 125,
        opacity: 0.8,
      },
      buttonPressed: {
        backgroundColor: 'rgba(15, 15, 15, 0.8)',
      },
      buttonText: {
        color: 'white',
        fontWeight: '600',
        marginRight: 8,
      },
      sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: 'white',
        bottom: 170
    },
    paymentItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        bottom :170
    },
});

export default Group; 