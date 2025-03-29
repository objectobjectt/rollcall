import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import LearnerNavigator from '@/navigators/learnerNavigator';
import TrainerNavigator from '@/navigators/trainerNavigator';
import AdminNavigator from '@/navigators/adminNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RoleLayout() {
  useFrameworkReady();
  const { getUserInfo } = useAuth();
  const [user, setUser] = useState(null);
  const userInfo = async () => {
    let tuser = await AsyncStorage.getItem('token');
    tuser = JSON.parse(tuser);

    setUser(tuser);
  };

  useEffect(() => {
    userInfo();
  }, []);

  return (
    <>
      {user?.role === 'learner' ? (
        <LearnerNavigator />
      ) : user?.role === 'trainer' ? (
        <TrainerNavigator />
      ) : user?.role === 'admin' ? (
        <AdminNavigator />
      ) : (
        <LearnerNavigator />
      )}
      <StatusBar style="auto" />
    </>
  );
}
