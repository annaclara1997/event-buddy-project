import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


import LoginScreen from "./screens/Login";
import SignupScreen from "./screens/Signup";
import HomeScreen from "./screens/Home";
import EventsScreen from "./screens/Events";
import EventDetails from "./screens/EventDetails";
import RecoveryPasswordScreen from "./screens/RecoveryPassword";
import FavoritesScreen from "./screens/Favorites";
import EditProfileScreen from './screens/EditProfile'; 
import ChangePasswordScreen from './screens/ChangePassword';
import ParticipatesScreen from './screens/Participates';
import ProfileScreen from "./screens/Profile";   
import { AuthProvider, useAuth } from "./context/AuthContext";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function UserTabs() {
  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === 'Home') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name === 'Eventos') {
        iconName = focused ? 'calendar' : 'calendar-outline';
      } else if (route.name === 'Favoritos') {
        iconName = focused ? 'heart' : 'heart-outline';
      } else if (route.name === 'Perfil') {
        iconName = focused ? 'person' : 'person-outline';
      }
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#6b3fa0',
    tabBarInactiveTintColor: '#636e72', 
    tabBarStyle: {
      backgroundColor: '#ffffff', 
      borderTopColor: '#dfe6e9', 
      height: 100, 
      paddingBottom: 6,
      paddingTop: 6,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '600',
    }
  })}
>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favoritos" component={FavoritesScreen} />
     <Tab.Screen name="Eventos" component={EventsScreen} /> 
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
       {user ? (
  <>
    <Stack.Screen name="UserTabs" component={UserTabs} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />  
    <Stack.Screen name="Participates" component={ParticipatesScreen} />
  </>
) : (
  <>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="RecoveryPassword" component={RecoveryPasswordScreen} />
  </>
)}
        <Stack.Screen name="EventDetails" component={EventDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
