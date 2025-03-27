import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
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

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function handleBarCodeScanned({ data }: { data: string }) {
    if (!scanned) {
      setScanned(true);
      // data:string basically
      // !!!!!!!!!!!!!!!!!!!!!!!!
      // TODO: Do something with the scanned data
      Alert.alert('QR Code Scanned', data, [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: 'orange',
          padding: 15,
          borderRadius: 5,
        }}
      >
        <Text style={styles.instructions}>
          Scan the QR code shown by the teacher
        </Text>
      </View>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  instructions: {
    textAlign: 'center',
    fontSize: 16,
    paddingTop: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
