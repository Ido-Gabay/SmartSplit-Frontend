import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Background from '../../Components/BackGround';
import axios from 'axios';

const Register = ({ navigation }) => {
  const apiUrl = 'http://localhost:8080/users';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [secretPass, setSecretPass] = useState('');

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

    const postData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      age: age
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    axios.post(apiUrl, postData, { headers })
      .then(response => {
        // Handle the successful response here
        console.log('Response:', response.data);
      })
      .catch(error => {
        // Handle the error here
        console.error('Error:', error);
      });
    console.log('Registration successful!');
    // Implement your registration logic here
    navigation.navigate('Login');
  };


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
