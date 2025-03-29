import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import BleManager from 'react-native-ble-manager';

class AttendanceUtils {
  
  static async requestLocationPermission() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  // Get Current Location
  static async getUserLocation() {
    const hasPermission = await this.requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        error => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  }

  // Request Bluetooth Permission (Android 12+)
  static async requestBluetoothPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  // Scan Nearby Bluetooth Devices
  static async scanBluetoothDevices() {
    const hasPermission = await this.requestBluetoothPermission();
    if (!hasPermission) {
      throw new Error('Bluetooth permission denied');
    }

    BleManager.start({ showAlert: false });

    return new Promise((resolve, reject) => {
      BleManager.scan([], 5, false)
        .then(() => {
          setTimeout(async () => {
            try {
              const devices = await BleManager.getDiscoveredPeripherals();
              resolve(devices);
            } catch (error) {
              reject(error);
            }
          }, 5000);
        })
        .catch(reject);
    });
  }
}

export default AttendanceUtils;
