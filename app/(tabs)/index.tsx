import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as FaceDetector from 'expo-face-detector';
import { useAuth } from '@/hooks/useAuth';
import { TeacherDashboard } from '@/components/TeacherDashboard';
import { StudentScanner } from '@/components/StudentScanner';
import StudentDashboardScreen from '@/components/StudentDashboard';

export default function HomeScreen() {
  const { user } = useAuth();
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    (async () => {
      const [cameraStatus, locationStatus] = await Promise.all([
        Camera.requestCameraPermissionsAsync(),
        Location.requestForegroundPermissionsAsync(),
      ]);

      setHasPermissions(
        cameraStatus.status === 'granted' && 
        locationStatus.status === 'granted'
      );
    })();
  }, []);

  if (!hasPermissions) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please grant camera and location permissions</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboardScreen />}
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