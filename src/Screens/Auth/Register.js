import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Background from '../../Components/BackGround';
import axios from 'axios';
import { API_URL } from '../../Utils/confing';

const Register = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleRegister = () => {

    // First name validation
    if (!firstName.trim()) {
      console.log('Please enter your first name');
      return;
    }

    // Last name validation
    if (!lastName.trim()) {
      console.log('Please enter your last name');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      console.log('Please enter your email');
      return;
    }

    if (!emailRegex.test(email)) {
      console.log('Please enter a valid email address');
      return;
    }

    // Password validation
    // At least 8 characters, at least one uppercase letter, one lowercase letter, and one digit
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!password.trim()) {
      console.log('Please enter your password');
      return;
    }

    if (!passwordRegex.test(password)) {
      console.log('Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, and one digit');
      return;
    }

    // Age validation between 18 and 120
    const ageRegex = /^(1[89]|[2-9][0-9]|1[01][0-9]|120)$/;

    if (!age) {
      console.log('Please enter your age');
      return;
    }

    if (!ageRegex.test(age)) {
      console.log('Age must be between 18 and 120');
      return;
    }
    if (!gender.trim()) {
      console.log('Please enter your gender');
      return;
    }
  
    const genderRegex = /^[MF]$/;
  
    if (!genderRegex.test(gender)) {
      console.log('Gender must be either "M" or "F"');
      return;
    }

    const postData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      age: age,
      gender: gender
    };
  
    const headers = {
      'Content-Type': 'application/json',
    };
  
    // Make sure to append the specific endpoint (/register) to the API_URL
    axios.post(`${API_URL}/users`, postData, { headers })
      .then(response => {
        // Handle the successful response here
        console.log('Response:', response.data);
        console.log('Registration successful!');
        navigation.navigate('Login');
      })
      .catch(error => {
        // Handle the error here
        console.error('Error:', error);
      });
    }

  return (
    <Background>
      <Image
        source={require('../../../assets/logo.png')}
        style={{ width: 120, height: 120, top: 20, left: 35 }}
      />
      <View style={styles.container}>
        <Text style={styles.loginContinueTxt}>Register to continue</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="First Name"
              placeholderTextColor="white"
              onChangeText={(text) => setFirstName(text)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Last Name"
              placeholderTextColor="white"
              onChangeText={(text) => setLastName(text)}
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              placeholderTextColor="white"
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              secureTextEntry
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor="white"
              onChangeText={(text) => setPassword(text)}
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Age"
              placeholderTextColor="white"
              onChangeText={(text) => setAge(text)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Gender"
              placeholderTextColor="white"
              onChangeText={(text) => setGender(text)}
            />
          </View>
        </View>

        

        <TouchableOpacity style={styles.loginBtn} onPress={handleRegister}>
          <Text style={styles.loginText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 50,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
  inputView: {
    width: '50%',
    backgroundColor: '#465881',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
    marginRight: 10,
  },
  inputText: {
    height: 50,
    color: 'white',
    textAlign: 'center',
  },
  loginContinueTxt: {
    fontSize: 25,
    textAlign: 'center',
    color: 'black',
    marginBottom: 22,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: 'black',
  },
});

export default Register;