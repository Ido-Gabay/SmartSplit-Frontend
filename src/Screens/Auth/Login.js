import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Background from '../../Components/BackGround';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Logic to handle login
    console.log('Email:', email);
    console.log('Password:', password);
    navigation.navigate('Home');
    // You can implement your login logic here
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
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassText}>Forgot Password?</Text>
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
    color: 'black',
    marginBottom: 22,
    fontWeight: 'bold',
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
    bottom: 30,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  footerText: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default Login;
