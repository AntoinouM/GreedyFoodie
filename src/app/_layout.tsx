import { Colors, Spacing } from '@/constants/theme';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  //#endregion
  const defaultColor = Colors.light.text;
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: defaultColor }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="fridge"
              size={Spacing.four}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'add',
          tabBarIcon: ({ color }) => (
            <Feather name="plus-square" size={Spacing.four} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'recipes',
          tabBarIcon: ({ color }) => (
            <Entypo name="open-book" size={Spacing.four} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
