import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Image, Switch, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

const MyProfile = () => {
  const { signOut, user } = useAuth();
  
  // States for settings toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [dataSync, setDataSync] = useState(true);
  
  // Function to handle section toggling
  const [showSettings, setShowSettings] = useState(false);
  
  const toggleSection = () => {
    setShowSettings(!showSettings);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            {/* <Image 
              source={{ uri: user?.avatar || 'https://via.placeholder.com/100' }} 
              style={styles.avatar}
              defaultSource={require('@/assets/default-avatar.png')}
            /> */}
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>{user?.name || 'User Name'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>{user?.role || 'Member'}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Account Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{user?.status || 'Active'}</Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>{user?.memberSince || 'January 2023'}</Text>
          </View>
          
          {/* Section toggle */}
          <TouchableOpacity style={styles.sectionToggle} onPress={toggleSection}>
            <Text style={styles.sectionToggleText}>
              {showSettings ? 'Hide Settings' : 'Show Settings'}
            </Text>
            <Ionicons 
              name={showSettings ? 'chevron-up' : 'chevron-down'} 
              size={24} 
              color="#4a90e2" 
            />
          </TouchableOpacity>
          
          {/* Settings Section */}
          {showSettings && (
            <View style={styles.settingsContainer}>
              <Text style={styles.settingsHeader}>Settings</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingTextContainer}>
                  <Ionicons name="notifications" size={22} color="#4a90e2" />
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#d9d9d9", true: "#a7c8f2" }}
                  thumbColor={notificationsEnabled ? "#4a90e2" : "#f4f3f4"}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingTextContainer}>
                  <Ionicons name="moon" size={22} color="#4a90e2" />
                  <Text style={styles.settingLabel}>Dark Mode</Text>
                </View>
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: "#d9d9d9", true: "#a7c8f2" }}
                  thumbColor={darkModeEnabled ? "#4a90e2" : "#f4f3f4"}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingTextContainer}>
                  <Ionicons name="finger-print" size={22} color="#4a90e2" />
                  <Text style={styles.settingLabel}>Biometric Login</Text>
                </View>
                <Switch
                  value={biometricEnabled}
                  onValueChange={setBiometricEnabled}
                  trackColor={{ false: "#d9d9d9", true: "#a7c8f2" }}
                  thumbColor={biometricEnabled ? "#4a90e2" : "#f4f3f4"}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingTextContainer}>
                  <Ionicons name="cloud-upload" size={22} color="#4a90e2" />
                  <Text style={styles.settingLabel}>Data Sync</Text>
                </View>
                <Switch
                  value={dataSync}
                  onValueChange={setDataSync}
                  trackColor={{ false: "#d9d9d9", true: "#a7c8f2" }}
                  thumbColor={dataSync ? "#4a90e2" : "#f4f3f4"}
                />
              </View>
              
              <TouchableOpacity style={styles.settingButton}>
                <View style={styles.settingTextContainer}>
                  <Ionicons name="lock-closed" size={22} color="#4a90e2" />
                  <Text style={styles.settingLabel}>Change Password</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingButton}>
                <View style={styles.settingTextContainer}>
                  <Ionicons name="globe" size={22} color="#4a90e2" />
                  <Text style={styles.settingLabel}>Language</Text>
                </View>
                <View style={styles.settingValueContainer}>
                  <Text style={styles.settingValue}>English</Text>
                  <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingButton}>
                <View style={styles.settingTextContainer}>
                  <Ionicons name="help-circle" size={22} color="#4a90e2" />
                  <Text style={styles.settingLabel}>Help & Support</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingButton}>
                <View style={styles.settingTextContainer}>
                  <Ionicons name="information-circle" size={22} color="#4a90e2" />
                  <Text style={styles.settingLabel}>About</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => signOut()}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={20} color="white" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  header: {
    backgroundColor: '#4a90e2',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4a90e2',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  editProfileButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4a90e2',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  editProfileText: {
    color: '#4a90e2',
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  statusBadge: {
    backgroundColor: '#e6f7ee',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    color: '#27ae60',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    padding: 8,
  },
  sectionToggleText: {
    color: '#4a90e2',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  settingsContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#7f8c8d',
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: '#4a90e2',
    marginHorizontal: 24,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyProfile;