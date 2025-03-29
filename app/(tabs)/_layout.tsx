import { useEffect, useState } from 'react';
import { Stack, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AdminTabNavigator,
  LearnerTabNavigator,
  TrainerTabNavigator,
} from '@/navigator/navigation';

export default function RoleLayout() {
  useFrameworkReady();
  const { getUserInfo, user } = useAuth();

  if (user?.role === 'learner') {
    return <LearnerTabNavigator />;
  } else if (user?.role === 'admin') {
    return <AdminTabNavigator />;
  } else {
    return <TrainerTabNavigator />;
  }
}
