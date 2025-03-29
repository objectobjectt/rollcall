import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router, useRouter } from 'expo-router';
import { useRouteNode } from 'expo-router/build/Route';
import react, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, Card } from 'react-native-paper';

const PermissionScreen = ({ onRequestPermissions }) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      padding: 20
    }}>
      <Card style={{ padding: 20, width: '90%', alignItems: 'center' }}>
        <MaterialIcons name="security" size={40} color="#6200ea" />
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' }}>
          Permission Required
        </Text>
        <Text style={{ fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 20 }}>
          Please grant camera and location permissions to continue.
        </Text>
        <Button mode="contained" onPress={onRequestPermissions}>
          Grant Permissions
        </Button>
      </Card>
    </View>
  );
};

export default function StudentScanner() {
    const [hasPermissions, setHasPermissions] = useState(false);
 
    const onRequestPermissions = async () => {
        const [cameraStatus, locationStatus] = await Promise.all([
          Camera.requestCameraPermissionsAsync(),
          Location.requestForegroundPermissionsAsync(),
        ]);
  
        setHasPermissions(
          cameraStatus.status === 'granted' && locationStatus.status === 'granted'
        );
        console.log("Camera Status: ", cameraStatus.status);
        console.log("Location Status: ", locationStatus.status);
        
    };

    useEffect(() => {
      onRequestPermissions();
    }, []);
  
    if (!hasPermissions) {
      return <PermissionScreen onRequestPermissions={onRequestPermissions} />;
    }

    return <StudentScannerIntenal />
  }

function StudentScannerIntenal() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  
  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function handleBarCodeScanned({ data }: { data: string }) {
    if (!scanned) {
      setScanned(true);
      // Process the scanned data
      // Alert.alert(
      //   'QR Code Scanned', 
      //   data, 
      //   [
      //     { text: 'OK', onPress: () => {
      //       setScanned(false)
      //       router.push({ pathname: '/(screens)/StudentMarkAttendaceV2', params: { qrData: data } })
      //     } },
      //   ],
      //   { cancelable: false }
      // );
      console.log("QR Code Scanned: ", data);
      setScanned(false)
      router.push({ pathname: '/(screens)/StudentMarkAttendace', params: { qrData: data } })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.instructions}>
          Scan the QR code shown by the teacher
        </Text>
      </View>

      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>

        {scanned && (
          <View style={styles.scanAgainContainer}>
            <TouchableOpacity
              style={styles.scanAgainButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.scanAgainText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  permissionCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  headerCard: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  instructions: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  camera: {
    flex: 1,
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
  },
  scanOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#3498db',
    borderRadius: 10,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  flipButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  scanAgainContainer: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scanAgainButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  scanAgainText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3498db',
  },
});