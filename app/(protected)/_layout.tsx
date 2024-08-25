import { Tabs } from 'expo-router';
import React from 'react';

// import { useColorScheme } from "@/lib/useColorScheme";

export default function ProtectedLayout() {
  // const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // tabBarStyle: {
        //   backgroundColor: theme.light.background,
        // },
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}