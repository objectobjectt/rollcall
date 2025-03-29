import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import StudentDashboardScreen from '@/components/StudentDashboard';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StudentDashboardScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
