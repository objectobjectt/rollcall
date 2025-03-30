import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import {
  Text,
  Card,
  Surface,
  ProgressBar,
  Divider,
} from 'react-native-paper';
import { Calendar, Clock, ChevronRight, AlertCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Api } from '@/constants/ApiConstants';

export default function StudentStatsScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get user info from AsyncStorage
        const token = await AsyncStorage.getItem('user.info');
        if (token) {
          const parsedToken = JSON.parse(token);
          setUser(parsedToken);
        }

        // Fetch attendance data
        const attendanceData = await Api.get(Api.LEARNER_ATTENDANCE);
        if (attendanceData?.responseJson?.success) {
          setAttendanceHistory(attendanceData.responseJson.data);
        }

        // Fetch attendance stats
        const attendanceStatsData = await Api.get(Api.LEARNER_ATTENDANCE_STATS);
        if (attendanceStatsData?.responseJson?.success) {
          setAttendanceStats(attendanceStatsData.responseJson.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy • h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  const getVerificationStatus = (attendance) => {
    if (attendance.isFullyVerified) return { text: 'Fully Verified', color: '#10B981' };
    if (attendance.isQRverified || attendance.isLocationVerified ||
      attendance.isFaceVerified || attendance.isManualVerified)
      return { text: 'Partially Verified', color: '#F59E0B' };
    return { text: 'Not Verified', color: '#EF4444' };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text variant="headlineMedium" style={styles.greeting}>
              Attendance Stats
            </Text>
            <Text variant="bodyLarge" style={styles.role}>
              {user ? user.name : "Student"}
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
        {!loading && attendanceStats && (
          <Card style={styles.attendanceCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium" style={styles.cardTitle}>
                  Overall Attendance
                </Text>
                <Calendar size={20} color="#6B7280" />
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={[styles.statNumber, { color: '#10B981' }]}>
                    {attendanceStats.overall.present.percentage}%
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>Present</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={[styles.statNumber, { color: '#F59E0B' }]}>
                    {attendanceStats.overall.partial.percentage}%
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>Partial</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={[styles.statNumber, { color: '#EF4444' }]}>
                    {attendanceStats.overall.absent.percentage}%
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>Absent</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <ProgressBar
                  progress={attendanceStats.overall.present.percentage / 100}
                  color="#10B981"
                  style={[styles.attendanceProgressBar, { backgroundColor: '#E9FAF2' }]}
                />
                <ProgressBar
                  progress={attendanceStats.overall.partial.percentage / 100}
                  color="#F59E0B"
                  style={[styles.attendanceProgressBar, { backgroundColor: '#FEF3E6' }]}
                />
                <ProgressBar
                  progress={attendanceStats.overall.absent.percentage / 100}
                  color="#EF4444"
                  style={[styles.attendanceProgressBar, { backgroundColor: '#FEE2E2' }]}
                />
              </View>

              <View style={styles.totalSessionsContainer}>
                <Text variant="bodyMedium" style={styles.totalSessions}>
                  Total Sessions: {attendanceStats.overall.totalSessions}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.historyCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Attendance History
              </Text>
              <Clock size={20} color="#6B7280" />
            </View>

            {loading ? (
              <Text>Loading attendance history...</Text>
            ) : attendanceHistory.length === 0 ? (
              <Text style={styles.noDataText}>No attendance records found</Text>
            ) : (
              attendanceHistory.map((item, index) => (
                <React.Fragment key={item.id}>
                  <View style={styles.historyItem}>
                    <View style={styles.historyItemLeft}>
                      <Text style={styles.courseName}>{item.session.course.name}</Text>
                      <Text variant="bodySmall" style={styles.sessionDate}>
                        {formatDate(item.createdAt)}
                      </Text>
                      <View style={styles.verificationContainer}>
                        <View
                          style={[
                            styles.verificationBadge,
                            { backgroundColor: getVerificationStatus(item).color + '20' }
                          ]}
                        >
                          <Text
                            style={[
                              styles.verificationText,
                              { color: getVerificationStatus(item).color }
                            ]}
                          >
                            {getVerificationStatus(item).text}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.sessionStatusContainer}>
                      <Text
                        style={[
                          styles.sessionStatus,
                          { color: item.session.isActive ? '#10B981' : '#6B7280' }
                        ]}
                      >
                        {item.session.isActive ? 'Active' : 'Ended'}
                      </Text>
                      <ChevronRight size={18} color="#6B7280" />
                    </View>
                  </View>
                  {index < attendanceHistory.length - 1 && <Divider style={styles.divider} />}
                </React.Fragment>
              ))
            )}
          </Card.Content>
        </Card>

        <Card style={styles.verificationMethodsCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Verification Methods Used
              </Text>
            </View>

            {!loading && attendanceHistory.length > 0 && (
              <View style={styles.verificationMethodsContainer}>
                {[
                  { label: 'QR Code', key: 'isQRverified', count: attendanceHistory.filter(a => a.isQRverified).length },
                  { label: 'Location', key: 'isLocationVerified', count: attendanceHistory.filter(a => a.isLocationVerified).length },
                  { label: 'Face', key: 'isFaceVerified', count: attendanceHistory.filter(a => a.isFaceVerified).length },
                  { label: 'Manual', key: 'isManualVerified', count: attendanceHistory.filter(a => a.isManualVerified).length },
                  { label: 'Bluetooth', key: 'isBluetoothVerified', count: attendanceHistory.filter(a => a.isBluetoothVerified).length },
                ].map((method, index) => (
                  <View key={method.key} style={styles.verificationMethodItem}>
                    <View style={styles.verificationMethodNameContainer}>
                      <Text variant="bodyMedium" style={styles.verificationMethodName}>
                        {method.label}
                      </Text>
                    </View>
                    <View style={styles.verificationMethodBarContainer}>
                      <View style={styles.verificationMethodBarBackground}>
                        <View
                          style={[
                            styles.verificationMethodBar,
                            {
                              width: `${(method.count / attendanceHistory.length) * 100}%`,
                              backgroundColor: method.count > 0 ? '#4A5CFF' : '#E5E7EB'
                            }
                          ]}
                        />
                      </View>
                      <Text variant="bodySmall" style={styles.verificationMethodCount}>
                        {method.count}/{attendanceHistory.length}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
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
  historyCard: {
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verificationMethodsCard: {
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
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
  },
  statLabel: {
    color: '#6B7280',
    marginTop: 5,
  },
  progressContainer: {
    gap: 8,
  },
  attendanceProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  totalSessionsContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  totalSessions: {
    color: '#6B7280',
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  historyItemLeft: {
    flex: 1,
  },
  courseName: {
    color: '#2C3A5A',
    fontWeight: '600',
    fontSize: 16,
  },
  sessionDate: {
    color: '#6B7280',
    marginTop: 4,
  },
  verificationContainer: {
    marginTop: 8,
    flexDirection: 'row',
  },
  verificationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sessionStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionStatus: {
    marginRight: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    backgroundColor: '#E5E7EB',
  },
  noDataText: {
    textAlign: 'center',
    padding: 20,
    color: '#6B7280',
  },
  verificationMethodsContainer: {
    gap: 12,
  },
  verificationMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verificationMethodNameContainer: {
    width: '30%',
  },
  verificationMethodName: {
    color: '#2C3A5A',
    fontWeight: '500',
  },
  verificationMethodBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verificationMethodBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  verificationMethodBar: {
    height: '100%',
    borderRadius: 4,
  },
  verificationMethodCount: {
    color: '#6B7280',
    width: 45,
    textAlign: 'right',
  },
});
