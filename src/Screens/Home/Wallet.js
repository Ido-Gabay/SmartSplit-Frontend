import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, Image, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Background from "../../Components/BackGround";
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import { API_URL } from '../../Utils/confing'

const fetchUserCards = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/cards/user/${userId}`);
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
    setDefaultCardId(cardId);
  };

  const handleAddCardPress = () => {
    navigation.navigate('AddCard');
  };

  const handleSaveDefaultCard = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');

      if (storedUserId && defaultCardId) {
        // Update local state first
        setDefaultCardId(defaultCardId);

        // Then, update the default card for the user in the database
        await axios.put(`${API_URL}/users/setDefaultCard/${JSON.parse(storedUserId)}/${defaultCardId}`);

        // Trigger a refresh after updating the default card
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
      <Text style={styles.heading}>My Wallet</Text>
      <View style={styles.container}>
        {userCards.map((card) => (
          <View key={card.id} style={styles.cardContainer}>
            <CheckBox
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
        <View>
          {/* Add a centered bottom button with white background and "Add Card +" text */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddCardPress}>
            <Text style={styles.buttonText}>Add Card <MaterialIcons name="add" size={20} color="black" /></Text>
          </TouchableOpacity>
          </View>
          {/* Add a centered bottom button with white background and "Set Default Card" text */}
          {defaultCardId && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveDefaultCard}>
              <Text style={styles.buttonText}>Apply Changes</Text>
            </TouchableOpacity>
          )}
        
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 90,
    left: 120,
    alignItems: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    right: 60
  },
  cardNumber: {
    fontSize: 24,
    marginRight: 10,
    fontFamily: "AppleSDGothicNeo-Regular",
    top: 6,
  },
  cardImage: {
    width: 100,
    height: 80,
  },
  heading: {
    fontSize: 24,
    top: 70,
    textAlign:'center',
    fontFamily: 'Avenir-HeavyOblique',
  },
  addButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 70,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    right: 120,
    width: 350
  },
  saveButton: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    left: 17,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    bottom : 150
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'AppleSDGothicNeo-Bold',
  },
  checkBoxContainer: {
    right: 120,
  },
});

export default Wallet;
