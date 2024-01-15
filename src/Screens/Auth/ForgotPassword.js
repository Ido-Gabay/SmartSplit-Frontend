import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Background from '../../Components/BackGround';

const ForgotPassword = () => {
  const [oldPassWord, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleForgotPassword = () => {
    // Logic to handle forgot password
    console.log('OldPassword:', oldPassWord);
    console.log('NewPassword:', newPassword);
    console.log('Confirm Password:', confirmPassword);
    // You can implement your forgot password logic here
  };

  return (
    <Background>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/logo.png')}
          style={{ width: 150, height: 150, bottom: 10 }}
        />
        <Text style={styles.loginContinueTxt}>Forgot Password?</Text>
        <Text style={styles.subText}>
          Enter your old password and the new one.
        </Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Old Paasword"
            placeholderTextColor="white"
            onChangeText={(text) => setOldPassword(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="New Paasword"
            placeholderTextColor="white"
            onChangeText={(text) => setNewPassword(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Confirm Password"
            placeholderTextColor="white"
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>
        <TouchableOpacity style={styles.resetBtn} onPress={handleForgotPassword}>
          <Text style={styles.resetText}>RESET PASSWORD</Text>
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
  inputView: {
    width: '80%',
    backgroundColor: '#465881',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'white',
  },
  loginContinueTxt: {
    fontSize: 25,
    textAlign: 'center',
    color: 'black',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    marginBottom: 30,
  },
  resetBtn: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  resetText: {
    color: 'black',
  },
});

export default ForgotPassword;
