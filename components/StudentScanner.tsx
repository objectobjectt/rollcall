import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as FaceDetector from 'expo-face-detector';
import { verifyLocation } from '@/utils/location';
import { verifyFace } from '@/utils/faceDetection';

export function StudentScanner() {
  const [scanning, setScanning] = useState(false);
  const cameraRef = useRef(null);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanning) return;
    setScanning(true);

    try {
      // 1. Verify QR Code
      const qrData = JSON.parse(data);
      
      // 2. Check Location
      const location = await Location.getCurrentPositionAsync({});
      const isLocationValid = verifyLocation(location, qrData.coordinates);
      
      if (!isLocationValid) {
        Alert.alert('Error', 'You must be in the classroom to mark attendance');
        return;
      }

      // 3. Verify Face
      const faceVerified = await verifyFace(cameraRef);
      
      if (!faceVerified) {
        Alert.alert('Error', 'Face verification failed');
        return;
      }

      // 4. Mark Attendance
      // Implement attendance marking logic here

      Alert.alert('Success', 'Attendance marked successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        onBarCodeScanned={handleBarCodeScanned}
        onFacesDetected={({ faces }) => {
          // Handle face detection
        }}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
          minDetectionInterval: 100,
          tracking: true,
        }}
      >
        <View style={styles.overlay}>
          <Text style={styles.scanText}>
            Scan QR Code to Mark Attendance
          </Text>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});