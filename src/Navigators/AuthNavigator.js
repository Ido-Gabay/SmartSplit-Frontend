import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../Screens/Auth/Login';
import ForgotPassword from '../Screens/Auth/ForgotPassword';
import Register from '../Screens/Auth/Register';
import DrawerNavigator from './DrawerNavigator';
import AddCard from '../Components/AddCard';
import Group from '../Components/Group';
import Wallet from '../Screens/Home/Wallet';
import Payment from '../Components/Payment'

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{
        headerTintColor : 'black',
        headerBackTitleVisible : false,
        headerBackTitleStyle: {
            color :'black'
        },
        headerStyle: {
            backgroundColor :'#f1ceff'
        }
    }} initialRouteName='Login'>
        <Stack.Screen name="Login" component={Login} options={{headerShown : false}}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
        <Stack.Screen name="Register" component={Register}/>
        <Stack.Screen name="Home" component={DrawerNavigator} options={{headerShown : false}}/>
        <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="AddCard" component={AddCard} />
        <Stack.Screen name="Group" component={Group} />
        <Stack.Screen name="Payment" component={Payment} />
    </Stack.Navigator>
  );
}
export default AuthNavigator;