import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Check, X, Clock, MapPin, Bluetooth, Camera, Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const classInfo = {
  className: 'Computer Science 3A',
  teacherName: 'Dr. Emily Rodriguez',
  subject: 'Advanced Algorithms',
  lectureTime: '10:30 AM - 12:00 PM'
};

export const AttendanceMarkScreen = () => {
  const router = useRouter();
  
  const [verificationSteps, setVerificationSteps] = useState({
    qrScanned: 'success', // Already completed since page is pushed after QR scan
    locationVerified: 'pending',
    bluetoothVerified: 'pending',
    faceDetected: 'pending',
    livenessChecked: 'pending'
  });

  const [attendanceStatus, setAttendanceStatus] = useState('in_progress');
  const [qrTimer, setQrTimer] = useState(120); // 2-minute QR validity

  useEffect(() => {
    const timer = setInterval(() => {
      setQrTimer(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          if (attendanceStatus === 'in_progress') {
            setAttendanceStatus('error');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check if all steps are complete
  useEffect(() => {
    const allComplete = Object.values(verificationSteps).every(status => status === 'success');
    if (allComplete) {
      setAttendanceStatus('success');
    }
  }, [verificationSteps]);

  const handleVerificationStep = (step) => {
    // For face detection, navigate to the specified path
    if (step === 'faceDetected') {
      router.push('/FaceDetection');
    } else {
      // For demo purposes, simulate the verification success for other steps
      if (verificationSteps[step] !== 'success') {
        setTimeout(() => {
          setVerificationSteps(prev => ({ ...prev, [step]: 'success' }));
        }, 1500);
      }
    }
  };

  const handleRetry = () => {
    setVerificationSteps({
      qrScanned: 'success', // Keep QR as success
      locationVerified: 'pending',
      bluetoothVerified: 'pending',
      faceDetected: 'pending',
      livenessChecked: 'pending'
    });
    setAttendanceStatus('in_progress');
    setQrTimer(120);
  };

  const handleDone = () => {
    // Navigate back to the home screen
    router.push('/(tabs)');
  };

  const renderVerificationIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock color="#FFA500" size={24} />;
      case 'processing':
        return <ActivityIndicator size="small" color="#0000ff" />;
      case 'success':
        return <Check color="#4CAF50" size={24} />;
      case 'error':
        return <X color="#FF0000" size={24} />;
    }
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 'qrScanned':
        return <Camera color="#555" size={20} />;
      case 'locationVerified':
        return <MapPin color="#555" size={20} />;
      case 'bluetoothVerified':
        return <Bluetooth color="#555" size={20} />;
      case 'faceDetected':
        return <Camera color="#555" size={20} />;
      case 'livenessChecked':
        return <Shield color="#555" size={20} />;
    }
  };

  if (attendanceStatus === 'success') {
    return (
      <SafeAreaView style={styles.successContainer}>
        <Check color="#4CAF50" size={120} />
        <Text style={styles.successTitle}>Attendance Marked Successfully!</Text>
        <Text style={styles.successSubtitle}>
          {classInfo.className} | {classInfo.subject}
        </Text>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (attendanceStatus === 'error') {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <X color="#FF0000" size={120} />
        <Text style={styles.errorTitle}>Attendance Verification Failed</Text>
        <Text style={styles.errorSubtitle}>
          {qrTimer <= 0 ? 'QR code expired' : 'Please contact admin or try again'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={() => router.push('/')}
        >
          <Text style={styles.homeButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Format step name for display
  const formatStepName = (step) => {
    return step
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace('Qr', 'QR');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.className}>{classInfo.className}</Text>
        <Text style={styles.teacherName}>{classInfo.teacherName}</Text>
        <Text style={styles.lectureInfo}>{classInfo.subject} | {classInfo.lectureTime}</Text>
      </View>

      <View style={styles.qrTimerContainer}>
        <Text style={[styles.qrTimerText, qrTimer < 30 && {color: '#FF0000'}]}>
          QR Valid For: {Math.floor(qrTimer / 60)}:{(qrTimer % 60).toString().padStart(2, '0')}
        </Text>
      </View>

      <View style={styles.verificationContainer}>
        {Object.entries(verificationSteps).map(([step, status]) => (
          <View 
            key={step}
            style={[
              styles.verificationStep, 
              status === 'success' && styles.verificationStepComplete
            ]}
          >
            <View style={styles.stepInfoContainer}>
              <View style={styles.iconWrapper}>
                {renderVerificationIcon(status)}
              </View>
              <Text style={styles.verificationStepText}>{formatStepName(step)}</Text>
            </View>
            
            {step !== 'qrScanned' && status !== 'success' ? (
              <TouchableOpacity 
                style={styles.verifyButton}
                onPress={() => handleVerificationStep(step)}
                disabled={status === 'processing'}
              >
                <View style={styles.buttonIcon}>
                  {getStepIcon(step)}
                </View>
                <Text style={styles.verifyButtonText}>
                  {status === 'processing' ? 'Verifying...' : 'Verify'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </View>
      
      <Text style={styles.instructionText}>
        Please complete all verification steps to mark attendance
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: 40
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10
  },
  backButton: {
    padding: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 8
  },
  backButtonText: {
    color: '#333',
    fontWeight: '600'
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  className: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  teacherName: {
    fontSize: 18,
    color: '#666',
    marginTop: 5
  },
  lectureInfo: {
    fontSize: 16,
    color: '#888',
    marginTop: 5
  },
  qrTimerContainer: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '90%'
  },
  qrTimerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  verificationContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  verificationStep: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 7,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500'
  },
  verificationStepComplete: {
    borderLeftColor: '#4CAF50',
    backgroundColor: '#F0FFF0'
  },
  stepInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  iconWrapper: {
    width: 30,
    alignItems: 'center'
  },
  verificationStepText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333'
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  buttonIcon: {
    marginRight: 5
  },
  verifyButtonText: {
    color: '#0066CC',
    fontWeight: '600'
  },
  instructionText: {
    marginTop: 20,
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic'
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 20,
    textAlign: 'center'
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center'
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30
  },
  doneButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0000',
    marginTop: 20,
    textAlign: 'center'
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30
  },
  retryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  homeButton: {
    backgroundColor: '#333',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 15
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default AttendanceMarkScreen;