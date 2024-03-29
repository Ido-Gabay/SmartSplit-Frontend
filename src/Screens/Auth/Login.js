import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Background from '../../Components/BackGround';
import AuthService from '../../Services/AuthServiceAxios';

const Login = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
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

    AuthService.login(email, password)
      .then(
        (response) => {
          console.log('Login successful');
          navigation.navigate('Home');  // Updated line
          // No need for window.location.reload() in React Native
        },
        (error) => {
          console.error('Login error:', error);
        }
      );
  };

  return (
    <Background>
      <View style={styles.container}>
        <Image
          source={require('../../../assets/logo.png')}
          style={{ width: 150, height: 150 }}
        />
        <Text style={styles.loginContinueTxt}>Login in to continue</Text>
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
            placeholderTextColor='white'
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}> Don't have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupBtn}>Sign Up</Text>
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
    fontFamily: 'AppleSDGothicNeo-Bold',
    color: 'black',
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop:20,
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
  forgotPassText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 15,
  },
  footer: {
    bottom: '58%',
    justifyContent: 'center',
    textAlign:'center',
    flexDirection: 'row',
  },
  footerText: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default Login;