import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { useAuth } from '@/hooks/useAuth';
import StudentDashboardScreen from '@/components/StudentDashboard';

export default function HomeScreen() {
  const { user, getUserInfo } = useAuth();
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    (async () => {
      const [cameraStatus, locationStatus] = await Promise.all([
        Camera.requestCameraPermissionsAsync(),
        Location.requestForegroundPermissionsAsync(),
      ]);

      setHasPermissions(
        cameraStatus.status === 'granted' && locationStatus.status === 'granted'
      );
    })();
  }, []);

  const userInfo = async () => {
    await getUserInfo();
  };

  useEffect(() => {
    userInfo();
  }, []);

  if (!hasPermissions) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Please grant camera and location permissions
        </Text>
      </View>
    );
  }

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
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
