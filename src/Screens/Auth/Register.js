import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Background from '../../Components/BackGround';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthday, setBirthday] = useState('');
  const [secretPass, setSecretPass] = useState('');

  const handleRegister = () => {
    // Logic to handle registration
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Phone Number:', phoneNumber);
    console.log('Birthday:', birthday);
    console.log('Secret Password:', secretPass);
    // You can implement your registration logic here
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
              placeholder="Phone Number"
              placeholderTextColor="white"
              onChangeText={(text) => setPhoneNumber(text)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Birthday"
              placeholderTextColor="white"
              onChangeText={(text) => setBirthday(text)}
            />
          </View>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            secureTextEntry
            placeholder="Secret Password"
            placeholderTextColor="white"
            onChangeText={(text) => setSecretPass(text)}
          />
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
