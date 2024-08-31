import { Tabs } from 'expo-router';
import React from 'react';

const ProtectedLayout = () => {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};

export default ProtectedLayout;