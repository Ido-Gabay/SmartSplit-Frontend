import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';

import Wallet from '../Screens/Home/Wallet'
import Settings from '../Screens/Home/Settings';
import BottomTabNavigator from './BottomTabNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomDrawer from '../Components/CustomDrawer';

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#a45aff',
        drawerActiveTintColor: 'white',
        drawerLabelStyle: {
          marginLeft: -20,
        },
      }}
    >
      <Drawer.Screen name="Home" component={BottomTabNavigator}
        options={{
          title: 'Home',
          drawerIcon: ({ focused, color, size }) => (
            <Icon name="home-sharp" size={18} color={color} />
          ),
        }} />
      <Drawer.Screen name="Wallet" component={Wallet}
        options={{
          title: 'Wallet',
          drawerIcon: ({ focused, color, size }) => (
            <Icon name="wallet" size={18} color={color} />
          ),
        }} />
      <Drawer.Screen name="Settings" component={Settings}
        options={{
          title: 'Settings',
          drawerIcon: ({ focused, color, size }) => (
            <Icon name="settings" size={18} color={color} />
          ),
        }} />
    </Drawer.Navigator>
  );
}
export default DrawerNavigator;