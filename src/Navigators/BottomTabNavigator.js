import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from '../Screens/Home/Home';
import Wallet from '../Screens/Home/Wallet'
import { StyleSheet, Platform, TouchableOpacity } from 'react-native';
import CreateGroups from '../Screens/Home/CreateGroup'
import Settings from '../Screens/Home/Settings';
import CustomTabBarButton from '../Components/CustomTabBarButton';
import CustomTabBar from '../Components/CustomTabBar';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarInactiveTintColor: '#444',
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#a45aff',
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'ios-home-sharp' : 'ios-home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'CreateGroup') {
            iconName = focused ? 'add' : 'add-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          }

          return <Icon name={iconName} size={22} color={color} />
        }
      })}>
      <Tab.Screen name="Home" component={Home} options={{
        tabBarButton: props => <CustomTabBarButton route='home' {...props} />
      }} />
      <Tab.Screen name="Wallet" component={Wallet} options={{
        tabBarButton: props => <CustomTabBarButton {...props} />
      }} />
      <Tab.Screen name="CreateGroup" component={CreateGroups} options={{
        tabBarButton: props => <CustomTabBarButton {...props} />
      }} />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          headerShown: true,
          tabBarButton: props => (
            <CustomTabBarButton route='settings' {...props} />),
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Icon
                  name={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
                  size={30}
                  color={'#444'}
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
            );
          },
        }} />
    </Tab.Navigator>
  );
}
export default BottomTabNavigator;

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    bottom: 15,
    right: 10,
    left: 10,
    height: 92,
  }
});