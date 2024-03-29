import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Animated, Image } from 'react-native';
import Background from '../Components/BackGround';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../Utils/confing';

const cardChip = require('../../assets/chip.png');
const cardVisa = require('../../assets/visa.png');
const cardMastercard = require('../../assets/mastercard.png');

const AddCard = () => {
  const [userId, setUserId] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumbers, setCardNumbers] = useState('');
  const [cardMonth, setCardMonth] = useState('');
  const [cardYear, setCardYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [error, setError] = useState('');

  const animatedValue = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const getUserIdFromStorage = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(JSON.parse(storedUserId));
        } else {
          console.error("User ID not found in AsyncStorage");
        }
      } catch (error) {
        console.error('Error fetching user ID from AsyncStorage:', error.message);
      }
    };

    getUserIdFromStorage();
  }, []);

  const flipCard = () => {
    setIsCardFlipped(!isCardFlipped);
    Animated.timing(animatedValue, {
      toValue: isCardFlipped ? 0 : 180,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleCardNumberChange = (text) => {
    if (/^\d{0,16}$/.test(text)) {
      setCardNumbers(text);
    }
  };

  const handleCvvChange = (text) => {
    if (/^\d{0,3}$/.test(text)) {
      setCvv(text);
    }
  };

  const handleDateChange = (text) => {
    if (/^\d{0,2}(\/\d{0,2})?$/.test(text)) {
      const [month, year] = text.split('/');
      setCardMonth(month);
      setCardYear(year);
    }
  };

  const handleCardNameChange = (text) => {
    // Allow only letters, spaces, and apostrophes for the card name
    const validCardName = /^[a-zA-Z\s']*$/;
    if (validCardName.test(text) || text === '') {
      setCardName(text);
    }
  };

  const handleSubmit = async () => {
    if (!cardName || !cardNumbers || !cardMonth || !cardYear || !cvv) {
      setError('Please fill in all the fields.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/cards/${userId}`, {
        cardName,
        cardNumbers,
        cardMonth,
        cardYear,
        cvv,
      });

      console.log('Card created successfully:', response.data);
      setError('');

      navigation.navigate('Home');
    } catch (error) {
      console.error('Error creating card:', error.message);
      setError('Error creating card. Please try again.');
    }
  };

  const getCardTypeImage = () => {
    if (cardNumbers.startsWith('4')) return cardVisa;
    if (cardNumbers.startsWith('5')) return cardMastercard;
    return null;
  };

  const formatCardNumber = (number) => {
    const visibleDigits = 4;
    const hiddenDigits = Math.max(0, number.length - visibleDigits * 2);
    const maskedNumber =
      number.substring(0, visibleDigits) +
      '*'.repeat(hiddenDigits) +
      number.substring(number.length - visibleDigits);
    return maskedNumber;
  };

  const formatCvv = (cvv) => {
    const visibleDigits = 3;
    const hiddenDigits = Math.max(0, cvv.length - visibleDigits);
    const maskedCvv =
      cvv.substring(0, visibleDigits) +
      '*'.repeat(hiddenDigits);
    return maskedCvv;
  };

  const cardFrontOpacity = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: [1, 0],
  });

  const cardBackOpacity = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: [0, 1],
  });

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Animated.View style={[styles.card, { opacity: cardFrontOpacity }]}>
            <ImageBackground source={require('../../assets/card-background.jpg')} style={styles.cardBackground}>
              <ImageBackground source={cardChip} style={styles.chip} resizeMode="contain" />
              <ImageBackground source={getCardTypeImage()} style={styles.cardType} resizeMode="contain" />
              <View style={styles.cardDetails}>
                <Text style={[styles.creditCardInfo, styles.cardOwnerName]}>
                  {cardName.toUpperCase()}
                </Text>
                <Text style={[styles.creditCardInfo, styles.cardExpiry, styles.bottomRight]}>
                  {`${cardMonth}/${cardYear}`}
                </Text>
                <Text style={[styles.creditCardInfo, styles.cardNumber]}>
                  {formatCardNumber(cardNumbers)}
                </Text>
              </View>
            </ImageBackground>
          </Animated.View>

          <Animated.View style={[styles.card, styles.cardBack, { opacity: cardBackOpacity }]}>
            <ImageBackground source={require('../../assets/card-background.jpg')} style={styles.cardBackground}>
              <View style={styles.cardCvvContainer}>
                <View style={styles.blackStrip} />
                <View style={styles.whiteStrip} />
                <Text style={[styles.creditCardInfo, styles.cardCvv]}>
                  {formatCvv(cvv)}
                </Text>
              </View>
            </ImageBackground>
          </Animated.View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Card Number"
          value={cardNumbers}
          onChangeText={handleCardNumberChange}
          keyboardType="numeric"
          maxLength={16}
        />
        <TextInput
          style={styles.input}
          placeholder="Card Holder's Name"
          value={cardName}
          onChangeText={handleCardNameChange}
        />
        <TextInput
          style={styles.input}
          placeholder="MM/YY"
          value={`${cardMonth}/${cardYear}`}
          onChangeText={handleDateChange}
          maxLength={5}
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          value={cvv}
          onChangeText={handleCvvChange}
          keyboardType="numeric"
          maxLength={3}
          onFocus={() => flipCard()}
          onBlur={() => flipCard()}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  card: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 15,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 30,
  },
  cardBack: {
    backgroundColor: '#fff',
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    width: 60,
    height: 40,
    position: 'absolute',
    top: 30,
    left: 20,
  },
  cardType: {
    width: 60,
    height: 40,
    position: 'absolute',
    top: 20,
    right: 20,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  cardNumber: {
    fontSize: 24,
    bottom: 50,
  },
  cardOwnerName: {
    fontSize: 18,
    position: 'absolute',
    left: -20,
  },
  cardExpiry: {
    fontSize: 18,
    position: 'absolute',
    right: -20,
  },
  input: {
    height: 50,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#2364d2',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  creditCardInfo: {
    fontFamily: 'PingFang TC',
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
  blackStrip: {
    width: 480,
    height: 45,
    backgroundColor: '#000',
    bottom: 60,
    left: 0,
    right: 0,
    opacity: 0.8,
  },
  cardCvvContainer: {
    position: 'absolute',
    bottom: 60,
  },
  cardCvv: {
    fontSize: 20,
    color: 'black',
    left: 350,
    position: 'absolute',
  },
  whiteStrip: {
    width: 370,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    position: 'absolute',
    top: 5,
    left: 95,
    transform: [{ translateX: -40 }],
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default AddCard;
