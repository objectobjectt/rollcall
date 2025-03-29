import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, SafeAreaView, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

const FaceDetectionScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [detectionStatus, setDetectionStatus] = useState('waiting'); // 'waiting', 'processing', 'success', 'failed'
  const [detectionMessage, setDetectionMessage] = useState('Position your face in the frame');
  
  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    // Start the rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Start the pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Start the fade animation for the guidance oval
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate a face detection process after 5 seconds
    const detectionTimer = setTimeout(() => {
      setDetectionStatus('processing');
      setDetectionMessage('Analyzing face...');
      
      // After 3 seconds, set to success
      setTimeout(() => {
        setDetectionStatus('success');
        setDetectionMessage('Face detected successfully!');
        
        // Navigate back after 2 seconds
        setTimeout(() => {
          router.back();
        }, 2000);
      }, 3000);
    }, 5000);

    return () => {
      clearTimeout(detectionTimer);
    };
  }, []);

  // Request camera permissions if not granted
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Create interpolated animations
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need camera permission to detect your face.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing="front"
      >
        <SafeAreaView style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Face Detection</Text>
          </View>

          {/* Face oval guide */}
          <View style={styles.faceGuideContainer}>
            <Animated.View 
              style={[
                styles.faceGuide,
                {
                  opacity: fadeAnim,
                  borderColor: detectionStatus === 'success' ? '#4CAF50' : '#FFFFFF',
                }
              ]}
            />
          </View>

          {/* Status indicator and instruction */}
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusIndicator,
              detectionStatus === 'waiting' && styles.statusWaiting,
              detectionStatus === 'processing' && styles.statusProcessing,
              detectionStatus === 'success' && styles.statusSuccess,
              detectionStatus === 'failed' && styles.statusFailed,
            ]}>
              {detectionStatus === 'waiting' && <AlertCircle color="#FFF" size={24} />}
              {detectionStatus === 'processing' && <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Circle stroke="#FFF" strokeWidth={2} r={10} cx={12} cy={12} />
              </Animated.View>}
              {detectionStatus === 'success' && <Check color="#FFF" size={24} />}
              {detectionStatus === 'failed' && <AlertCircle color="#FFF" size={24} />}
            </View>
            <Text style={styles.statusText}>{detectionMessage}</Text>
          </View>

          {/* 3D Face Animation Guide */}
          <View style={styles.animationContainer}>
            <Text style={styles.animationTitle}>Face Detection Guide</Text>
            <Animated.View style={[
              styles.animationBox,
              {
                transform: [
                  { scale: scaleAnim }
                ]
              }
            ]}>
              <FaceAnimationSvg />
            </Animated.View>
            <Text style={styles.animationInstructions}>
              Keep your face centered and still
            </Text>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
    
  );

};

// SVG Face Animation Component
const FaceAnimationSvg = () => (
  <Svg height="120" width="120" viewBox="0 0 100 100">
    {/* Face outline */}
    <Circle cx="50" cy="50" r="30" stroke="#FFFFFF" strokeWidth="2" fill="none" />
    
    {/* Eyes */}
    <Circle cx="40" cy="45" r="4" fill="#FFFFFF" />
    <Circle cx="60" cy="45" r="4" fill="#FFFFFF" />
    
    {/* Nose */}
    <Path d="M50,50 L50,60 M45,58 L50,60 L55,58" stroke="#FFFFFF" strokeWidth="2" fill="none" />
    
    {/* Mouth */}
    <Path d="M40,65 Q50,70 60,65" stroke="#FFFFFF" strokeWidth="2" fill="none" />
    
    {/* Animated guide arrows */}
    <G opacity="0.8">
      <Path d="M18,50 L10,50 L15,45 M10,50 L15,55" stroke="#FFFFFF" strokeWidth="2" />
      <Path d="M82,50 L90,50 L85,45 M90,50 L85,55" stroke="#FFFFFF" strokeWidth="2" />
      <Path d="M50,18 L50,10 L45,15 M50,10 L55,15" stroke="#FFFFFF" strokeWidth="2" />
      <Path d="M50,82 L50,90 L45,85 M50,90 L55,85" stroke="#FFFFFF" strokeWidth="2" />
    </G>
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: Platform.OS === 'android' ? 40 : 15,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  faceGuideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: 240,
    height: 300,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusWaiting: {
    backgroundColor: '#FF9800',
  },
  statusProcessing: {
    backgroundColor: '#2196F3',
  },
  statusSuccess: {
    backgroundColor: '#4CAF50',
  },
  statusFailed: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  animationContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  animationTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  animationBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  animationInstructions: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  permissionText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FaceDetectionScreen;