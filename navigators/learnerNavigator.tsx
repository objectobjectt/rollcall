import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/app/(tabs)/learner';
import { Ionicons } from '@expo/vector-icons';
import StudentScanner from '@/app/(tabs)/learner/StudentScanner';
import HistoryScreen from '@/app/(tabs)/learner/history';
import Chat from '@/app/(tabs)/learner/aiChat';
import { History } from 'lucide-react-native';

const LearnerNavigator = () => {
  const learnerTab = createBottomTabNavigator();
  return (
    <learnerTab.Navigator>
      <learnerTab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <learnerTab.Screen
        name="Scan"
        component={StudentScanner}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan" color={color} size={size} />
          ),
        }}
      />
      <learnerTab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      />
    </learnerTab.Navigator>
  );
};

export default LearnerNavigator;
