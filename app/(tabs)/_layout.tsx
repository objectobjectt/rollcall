import { useEffect, useState } from 'react';
import { Stack, Tabs, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import {
  AdminTabNavigator,
  LearnerTabNavigator,
  TrainerTabNavigator,
} from '@/navigator/navigation';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RoleLayout() {
  useFrameworkReady();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser]: any = useState(null);

  useEffect(() => {
    async function checkToken() {
      const token = await AsyncStorage.getItem('user');
      if (!token) {
        router.replace('/(auth)/Login');
      } else {
        const parsedToken = JSON.parse(token);
        setUser(parsedToken);
        setLoading(false);
      }
    }
    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading User...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      {(() => {
        switch (user.role) {
          case 'learner':
            return <LearnerTabNavigator />;
          case 'admin':
            return <AdminTabNavigator />;
          case 'trainer':
            return <TrainerTabNavigator />;
          default:
            return <View />;
        }
      })()}
    </View>
  )
}
