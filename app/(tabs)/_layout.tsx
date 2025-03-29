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

export default function RoleLayout() {
  useFrameworkReady();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(auth)/Login');
    }
  }, [loading, user]);

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
        switch (user?.role) {
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
