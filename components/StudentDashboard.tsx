import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import {
  Text,
  Card,
  Button,
  Surface,
  ProgressBar,
  Chip,
} from 'react-native-paper';
import { router } from 'expo-router';
import { Users, Clock, BookOpen, Calendar, AlertCircle } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

const { width } = Dimensions.get('window');

export default function StudentDashboardScreen() {
  const { user, signOut } = useAuth();

  const renderStudentDashboard = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <TouchableOpacity onPress={() => signOut()}>
            <Text variant="headlineMedium" style={styles.greeting}>
              Welcome back, {user?.name}!
            </Text>
            </TouchableOpacity>
            <Text variant="bodyLarge" style={styles.role}>
              Student Dashboard
            </Text>
          </View>
          <Surface style={styles.notificationBadge} elevation={2}>
            <AlertCircle size={24} color="#4A5CFF" />
          </Surface>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.attendanceCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Attendance Overview
              </Text>
              <Calendar size={20} color="#6B7280" />
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statNumber}>85%</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Present</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statNumber}>12%</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Late</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={styles.statNumber}>3%</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Absent</Text>
              </View>
            </View>
            <ProgressBar
              progress={0.85}
              color="#4A5CFF"
              style={styles.attendanceProgressBar}
            />
          </Card.Content>
        </Card>

        <Card style={styles.classCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Today's Classes
              </Text>
              <Clock size={20} color="#6B7280" />
            </View>
            {[
              { name: 'Mathematics', time: '09:00 AM - 10:30 AM', color: '#4A5CFF' },
              { name: 'Physics', time: '11:00 AM - 12:30 PM', color: '#FF4A91' }
            ].map((classItem, index) => (
              <View key={index} style={styles.classItem}>
                <View style={[styles.classDot, { backgroundColor: classItem.color }]} />
                <View>
                  <Text style={styles.classPrimaryText}>{classItem.name}</Text>
                  <Text variant="bodySmall" style={styles.classSecondaryText}>
                    {classItem.time}
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* <View style={styles.quickActionContainer}>
          <Button 
            mode="contained" 
            onPress={handleScanQR}
            style={styles.quickActionButton}
            contentStyle={styles.quickActionButtonContent}
          >
            Scan Attendance QR
          </Button>
        </View> */}
      </ScrollView>
    </View>
  );

  return renderStudentDashboard();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationBadge: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: '#F0F4FF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: {
    color: '#2C3A5A',
    fontWeight: '700',
  },
  role: {
    color: '#6B7280',
    marginTop: 4,
  },
  attendanceCard: {
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#4A5CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontWeight: '700',
    color: '#2C3A5A',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  statNumber: {
    fontWeight: '700',
    color: '#4A5CFF',
  },
  statLabel: {
    color: '#6B7280',
    marginTop: 5,
  },
  attendanceProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  classCard: {
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  classDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 15,
  },
  classPrimaryText: {
    color: '#2C3A5A',
    fontWeight: '600',
  },
  classSecondaryText: {
    color: '#6B7280',
  },
  quickActionContainer: {
    marginTop: 20,
  },
  quickActionButton: {
    borderRadius: 12,
    backgroundColor: '#4A5CFF',
  },
  quickActionButtonContent: {
    height: 56,
  },
});