import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import Background from '../../Components/BackGround';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateGroup = () => {
  const navigation = useNavigation();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupPurpose, setGroupPurpose] = useState('');
  const [groupMoneyAmount, setGroupMoneyAmount] = useState(0);
  const [usersList, setUsersList] = useState([]);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          const currentUser = usersList.find(user => user.id === JSON.parse(storedUserId));
          setUserId(JSON.parse(storedUserId));
          setSelectedUsers([currentUser]); // Automatically add the current user to selectedUsers
        } else {
          console.error("User ID not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching user ID from AsyncStorage:", error);
      }
    };

    fetchUserId();
  }, [usersList]); // Include usersList as a dependency to ensure that selectedUsers gets updated when usersList changes

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users');
      setUsersList(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
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
    // Validate input fields
    if (!userId || !groupName.trim() || !groupPurpose.trim() || groupMoneyAmount <= 0 || selectedUsers.length === 0) {
      setError('Please fill in all fields and select at least one user.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/groups/${userId}`, {
        name: groupName,
        purpose: groupPurpose,
        moneyAmount: groupMoneyAmount,
        userIds: selectedUsers.map((user) => user.id),
      });

      if (response.status === 200) {
        navigation.navigate('Home');
        setSelectedUsers([]);
        setGroupName('');
        setGroupPurpose('');
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
      user.id !== userId && // Exclude the current user
      (user.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchInput.toLowerCase()))
  );

  return (
    <Background>
      <Image source={require('../../../assets/logo.png')} style={styles.logo} />
      <View style={styles.container}>
        <Text style={styles.heading}>Group Page</Text>
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
          <TextInput
            style={styles.input}
            placeholder="Group Purpose"
            value={groupPurpose}
            onChangeText={(text) => setGroupPurpose(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Group Money Amount"
            value={groupMoneyAmount.toString()}
            onChangeText={(text) => setGroupMoneyAmount(parseFloat(text))}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.createGroupBtn} onPress={handleCreateGroup}>
          <Text style={styles.buttonText}>Create Group</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </Background>
  );
};


const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 70,
  },
  logo: {
    width: 120,
    height: 120,
    top: 35,
    left: 20,
  },
  heading: {
    textAlign: 'center',
    fontSize: 40,
    marginBottom: 20,
    fontFamily: 'Avenir-HeavyOblique',
  },
  input: {
    fontSize: 16,
    padding: 10,
    height: 40,
    borderColor: 'gray',
    marginBottom: 20,
    paddingLeft: 10,
    color: 'black',
    borderWidth: 1,
    borderRadius: 8,
  },
  inputs: {
    top: 30,
  },
  createGroupBtn: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Avenir-HeavyOblique',
  },
  errorText: {
    color: 'red',
    top: 15,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CreateGroup;
