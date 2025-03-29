import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router, useRouter } from 'expo-router';
import { useRouteNode } from 'expo-router/build/Route';
import { useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

export default function StudentScanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionText}>
            We need your permission to use the camera
          </Text>
          <Button 
            onPress={requestPermission} 
            title="Grant Permission" 
            color="#3498db" 
          />
        </View>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function handleBarCodeScanned({ data }: { data: string }) {
    if (!scanned) {
      setScanned(true);
      // Process the scanned data
      Alert.alert(
        'QR Code Scanned', 
        data, 
        [
          { text: 'OK', onPress: () => {
            setScanned(false)
            router.push('/(screens)/StudentMarkAttendaceV2')
          } },
        ],
        { cancelable: false }
      );
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