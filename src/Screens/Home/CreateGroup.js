import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import Background from '../../Components/BackGround';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../Utils/confing';
import RNPickerSelect from 'react-native-picker-select';

const dropdownOptions = [
  { label: 'Clothing', value: 'Clothing' },
  { label: 'Cosmetic', value: 'Cosmetic' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Market', value: 'Market' },
  { label: 'Restaurant', value: 'Restaurant' },
  { label: 'Travel', value: 'Travel' },
];

const CreateGroup = () => {
  const navigation = useNavigation();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupPurpose, setGroupPurpose] = useState(null);
  const [groupMoneyAmount, setGroupMoneyAmount] = useState(0);
  const [usersList, setUsersList] = useState([]);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [userId, setUserId] = useState(null);
  const [suggestedAmount, setSuggestedAmount] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          const currentUser = usersList.find(user => user.id === JSON.parse(storedUserId));
          setUserId(JSON.parse(storedUserId));
          setSelectedUsers([currentUser]);
        } else {
          console.error("User ID not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching user ID from AsyncStorage:", error);
      }
    };

    fetchUserId();
  }, [usersList]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`);
        setUsersList(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserPress = (item) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.some((user) => user.id === item.id)
        ? prevUsers.filter((user) => user.id !== item.id)
        : [...prevUsers, item]
    );
  };

  const handleCreateGroup = async () => {
    if (!userId || !groupName.trim() || !groupPurpose || groupMoneyAmount <= 0 || selectedUsers.length === 0) {
      setError('Please fill in all fields and select at least one user.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/groups/${userId}`, {
        name: groupName,
        purpose: groupPurpose,
        moneyAmount: groupMoneyAmount,
        userIds: selectedUsers.map((user) => user.id),
      });

      if (response.status === 200) {
        navigation.navigate('Home');
        setSelectedUsers([]);
        setGroupName('');
        setGroupPurpose(null);
        setGroupMoneyAmount(0);
        fetchUsers();
      } else {
        console.error('Error creating group:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchInput(text);
  };

  const filteredUsers = usersList.filter(
    (user) =>
      user.id !== userId &&
      (user.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchInput.toLowerCase()))
  );

  const handleSuggestAmount = async () => {
    // Access currentUser from state
    const currentUser = usersList.find(user => user.id === userId);

    // Ensure currentUser exists before proceeding
    if (!currentUser) {
      console.error('Current user not found');
      return;
    }

    // Map gender to 0 for female and 1 for male
    const genderMapping = {
      "M": 1,
      "F": 0
    };
    const gender = currentUser.gender in genderMapping ? genderMapping[currentUser.gender] : null;

    const userData = {
      gender: gender,
      age: currentUser.age,
      category_clothing: 0,
      category_cosmetic: 0,
      category_electronics: 0,
      category_market: 0,
      category_restaurant: 0,
      category_travel: 0
    };

    // Set the category based on groupPurpose
    switch (groupPurpose) {
      case "Clothing":
        userData.category_clothing = 1;
        break;
      case "Cosmetic":
        userData.category_cosmetic = 1;
        break;
      case "Electronics":
        userData.category_electronics = 1;
        break;
      case "Market":
        userData.category_market = 1;
        break;
      case "Restaurant":
        userData.category_restaurant = 1;
        break;
      case "Travel":
        userData.category_travel = 1;
        break;
      default:
        break;
    }
    
    try {
      const response = await axios.post(`http://127.0.0.1:5000/predict`, userData);
      setSuggestedAmount(response.data.predicted_amount);
    } catch (error) {
      console.error('Error predicting transaction:', error);
    }
  };


  return (
    <Background>
      <Image source={require('../../../assets/logo.png')} style={styles.logo} />
      <View style={styles.staticContainer}>
        <Text style={styles.heading}>Create A Group</Text>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Search Users"
            value={searchInput}
            onChangeText={handleSearch}
          />
          {searchInput.length > 0 && (
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleUserPress(item)}>
                  <Text
                    style={{
                      color: selectedUsers.some((user) => user.id === item.id) ? 'blue' : 'black',
                    }}
                  >
                    {`${item.firstName} ${item.lastName}`}
                  </Text>
                </TouchableOpacity>
              )}
              initialNumToRender={4}
            />
          )}
          <View style={styles.inputs}>
            <TextInput
              style={styles.input}
              placeholder="Group Name"
              value={groupName}
              onChangeText={(text) => setGroupName(text)}
            />
            <RNPickerSelect
              style={pickerSelectStyles}
              placeholder={{
                label: 'Select Purpose',
                value: null,
              }}
              items={dropdownOptions}
              onValueChange={(value) => setGroupPurpose(value)}
              value={groupPurpose}
            />
            <Text style={styles.sliderLabel}>Money Amount To Split: ₪{groupMoneyAmount.toFixed(2)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={6000}
              step={1}
              value={groupMoneyAmount}
              onValueChange={(value) => setGroupMoneyAmount(value)}
            />
          </View>
          {/* Display suggested amount if available */}
          {suggestedAmount !== null && (
            <Text style={styles.suggestedAmountText}>
              Suggested Transaction Amount: {parseInt(suggestedAmount)} ₪
            </Text>
          )}
          <TouchableOpacity style={styles.createGroupBtn} onPress={handleCreateGroup}>
            <Text style={styles.buttonText}>Create Group</Text>
          </TouchableOpacity>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Button to suggest transaction amount */}
          {groupPurpose && (
            <TouchableOpacity style={styles.suggestAmountBtn} onPress={handleSuggestAmount}>
              <Text style={styles.segButtonText}>Suggest Transaction Amount</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  staticContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 80,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  container: {
    marginHorizontal: 5,
    marginTop: 7,
  },
  heading: {
    fontSize: 24,
    paddingBottom: 15,
    textAlign: 'center',
    fontFamily: 'Avenir-HeavyOblique',
  },
  logo: {
    width: 120,
    height: 120,
    top: 35,
    left: 20,
  },
  input: {
    fontSize: 16,
    padding: 10,
    height: 40,
    borderColor: 'gray',
    marginBottom: 30,
    paddingLeft: 10,
    color: 'black',
    borderWidth: 1,
    borderRadius: 8,
  },
  slider: {
    marginTop: 20,
    width: '100%',
    height: 40,
  },
  sliderLabel: {
    fontSize: 16,
    color: 'black',
  },
  createGroupBtn: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginTop: 40,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  suggestAmountBtn: {
    backgroundColor: '#4c0dcf',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'AppleSDGothicNeo-Bold',
    color: 'black',
  },
  segButtonText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'AppleSDGothicNeo-Bold',
    color: 'white',
  },
  errorText: {
    color: 'red',
    top: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  suggestedAmountText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight:'bold',
    textAlign:'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 30,
  },
});

export default CreateGroup;
