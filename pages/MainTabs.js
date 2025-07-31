import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import DashboardStack from '../screens/DashboardStack'; 
import SearchScreen from '../screens/SearchScreen';
import ProfileStack from '../screens/ProfileStack'; 
const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1e3a8a',
        tabBarStyle: {
          backgroundColor: '#f8fafc',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderRadius: 30,
          height: 60,
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 5,
          paddingBottom: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardStack}
        options={{
          tabBarIcon: ({ color }) => <Icon name="home-outline" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="search-outline" size={22} color={color} />
          ),
        }}
      />
     <Tab.Screen
      name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color }) => <Icon name="person-outline" size={22} color={color} />,
        }}
  />
    </Tab.Navigator>
  );
}
