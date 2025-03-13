import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../types';

// Henüz oluşturulmamış ekranlar için geçici bileşenler
import HomeScreen from '../screens/HomeScreen';
import AnimeDetailScreen from '../screens/AnimeDetailScreen';
import WatchAnimeScreen from '../screens/WatchAnimeScreen';
import BrowseScreen from '../screens/BrowseScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#ef4444',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#1f2937',
          borderTopWidth: 0,
        },
        headerStyle: {
          backgroundColor: '#1f2937',
        },
        headerTintColor: '#ffffff',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'Ana Sayfa',
        }}
      />
      <Tab.Screen 
        name="Browse" 
        component={BrowseScreen} 
        options={{
          title: 'Keşfet',
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{
          title: 'Ara',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1f2937',
          },
          headerTintColor: '#ffffff',
          cardStyle: { backgroundColor: '#111827' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AnimeDetail" 
          component={AnimeDetailScreen} 
          options={{ title: 'Anime Detayları' }}
        />
        <Stack.Screen 
          name="WatchAnime" 
          component={WatchAnimeScreen} 
          options={{ title: 'İzle' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 