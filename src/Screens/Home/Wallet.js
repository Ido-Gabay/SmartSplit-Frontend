import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, Image, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Background from "../../Components/BackGround";
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';

const BASE_URL = 'http://localhost:8080';

const fetchUserCards = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/cards/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const Wallet = ({ navigation }) => {
  const [userCards, setUserCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [defaultCardId, setDefaultCardId] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');

      if (storedUserId) {
        const cards = await fetchUserCards(JSON.parse(storedUserId));
        setUserCards(cards);
      } else {
        console.error("User ID not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error fetching user cards:", error);
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  useEffect(() => {
    if (dataLoaded && userCards.length === 0) {
      navigation.navigate('AddCard');
    }
  }, [dataLoaded, userCards, navigation]);

  const handleCheckboxChange = (cardId) => {
    setDefaultCardId(cardId === defaultCardId ? null : cardId);
  };

  const handleAddCardPress = () => {
    navigation.navigate('AddCard');
  };

  const handleSaveDefaultCard = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');

      if (storedUserId && defaultCardId) {
        await axios.put(`${BASE_URL}/users/setDefaultCard/${JSON.parse(storedUserId)}/${defaultCardId}`);
        // Set dataLoaded to false before fetching data to trigger a refresh
        setDataLoaded(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error setting default card:", error);
    }
  };

  if (loading) {
    return (
      <Background>
        <ActivityIndicator size="large" color="#0000ff" />
      </Background>
    );
  }

  if (error) {
    return (
      <Background>
        {/* Handle error UI */}
      </Background>
    );
  }

  return (
    <Background>
      <Image
        source={require('../../../assets/logo.png')}
        style={{ width: 120, height: 120, top: 35, left: 20 }}
      />
      <Text style={styles.Text}>Wallet</Text>
      <View style={styles.container}>
        {userCards.map((card) => (
          <View key={card.id} style={styles.cardContainer}>
            <CheckBox
              title="Default Card"
              checked={card.id === defaultCardId}
              onPress={() => handleCheckboxChange(card.id)}
              containerStyle={styles.checkBoxContainer}
            />
            <Text style={styles.cardNumber}>***{card.cardNumbers.slice(-4)}</Text>
            <Image
              source={require('../../../assets/card.png')}
              style={styles.cardImage}
            />
          </View>
        ))}

        {/* Add a centered bottom button with white background and "Add Card +" text */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddCardPress}>
          <Text style={styles.buttonText}>Add Card <MaterialIcons name="add" size={20} color="black" /></Text>
        </TouchableOpacity>

        {/* Add a centered bottom button with white background and "Set Default Card" text */}
        {defaultCardId && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveDefaultCard}>
            <Text style={styles.buttonText}>Set Default Card</Text>
          </TouchableOpacity>
        )}
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    left: 120,
    alignItems: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    right: 100
  },
  cardNumber: {
    fontSize: 18,
    marginRight: 10,
  },
  cardImage: {
    width: 60,
    height: 40,
  },
  Text: {
    textAlign: "center",
    fontSize: 40,
    top: 70,
    fontFamily: 'Avenir-HeavyOblique'
  },
  addButton: {
    position: 'absolute',
    bottom: 200,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  saveButton: {
    position: 'absolute',
    bottom: 280,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    marginRight: 5,
  },
  checkBoxContainer: {
    right: 60,
  },
});

export default Wallet;
