import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'My Fridge',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="fridge" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'add',
          tabBarIcon: ({ color }) => (
            <Feather name="plus-square" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'recipes',
          tabBarIcon: ({ color }) => (
            <Entypo name="open-book" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
