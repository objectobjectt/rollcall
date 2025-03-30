import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Text, Card, Chip, Button, Avatar, Modal, Portal, List, Provider, Divider, Searchbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { Api } from '@/constants/ApiConstants';

// This would come from your API in production
const mockModuleData = {
  "id": "babf8013-4d75-42ab-a0b2-e1f099d195ad",
  "name": "testing module",
  "level": "Level 1",
  "sessions": [
    {
      "id": "b4de38c6-b5dd-4af5-ae1b-b333cfb5dcc3",
      "isActive": false,
      "createdAt": "2025-03-30T00:12:34.269Z",
      "attendences": [
        {
          "id": "1e34f668-f16f-4a43-8607-5d9dd0b67332",
          "studentId": "a3c585a6-2066-4701-b9a9-41ef87a399ed",
          "student": {
            "id": "a3c585a6-2066-4701-b9a9-41ef87a399ed",
            "name": "abc",
            "email": "abc@example.com"
          }
        }
      ]
    },
    {
      "id": "4d092733-d23f-49b9-b5cc-249dd6532868",
      "isActive": false,
      "createdAt": "2025-03-30T06:25:29.934Z",
      "attendences": []
    },
    {
      "id": "02e6a3ba-8bb8-465b-b7e0-6a5dfc01f14f",
      "isActive": false,
      "createdAt": "2025-03-30T06:25:34.598Z",
      "attendences": []
    }
  ],
  "students": 1,
  "nextSession": "",
  "learners": [
    {
      "learner": {
        "id": "a3c585a6-2066-4701-b9a9-41ef87a399ed",
        "name": "abc",
        "email": "abc@example.com"
      }
    }
  ]
};

export default function SessionAttendanceHistoryScreen() {
  const { signOut, user } = useAuth();
  const [selectedSession, setSelectedSession] = useState(null);
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSessions, setFilteredSessions] = useState(mockModuleData.sessions);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await Api.get(Api.TRAINER_COURSES);
      const courses = response.responseJson.courses;
      if (!courses) return;
      let newCourses = [];
      for (let i = 0; i < courses.length; i++) {
        let course = courses[i];
        let newCourse = {
          id: course.id,
          name: course.name,
          level: 'Level 1',
          sessions: course.sessions,
          students: course.learners.length,
          nextSession: "",
          learners: course.learners,
        };
        newCourses.push(newCourse);
      }
      setData(newCourses || mockModuleData);
      setLoadingData(false);
    }

    fetchCourses();
  }, []);



  // Filter sessions based on search query
  useFocusEffect(
    useCallback(() => {
      if (searchQuery.trim() === '') {
        setFilteredSessions(mockModuleData.sessions);
        return;
      }

      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = mockModuleData.sessions.filter(session => {
        const sessionDate = new Date(session.createdAt).toLocaleDateString();
        return sessionDate.toLowerCase().includes(lowerCaseQuery);
      });

      setFilteredSessions(filtered);
    }, [searchQuery])
  );

  const onChangeSearch = query => {
    setSearchQuery(query);
  };

  const showSessionDetails = (session) => {
    setSelectedSession(session);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderSessionCard = (session, index) => {
    const sessionNumber = index + 1;
    const attendanceCount = session.attendences.length;
    const totalLearners = mockModuleData.learners.length;
    const attendancePercentage = totalLearners > 0
      ? Math.round((attendanceCount / totalLearners) * 100)
      : 0;

    // Color scheme with professional blues
    let statusColor = '#2196F3'; // Standard blue
    let statusText = 'Good';

    if (attendancePercentage < 80) {
      statusColor = '#1976D2'; // Darker blue
      statusText = 'Average';
    }
    if (attendancePercentage < 60) {
      statusColor = '#0D47A1'; // Deep blue
      statusText = 'Low';
    }
    if (loadingData) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#0052CC" />
          <Text style={{ fontSize: 16, color: '#0052CC', marginTop: 12 }}>Loading...</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={session.id}
        onPress={() => showSessionDetails(session)}
        activeOpacity={0.7}
      >
        <Card style={styles.sessionCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.subjectTitle}>Session {sessionNumber}</Text>
                <Text style={styles.dateText}>
                  {formatDate(session.createdAt)}
                </Text>
              </View>
              <Chip
                style={[styles.statusChip, { backgroundColor: statusColor }]}
                textStyle={{ color: 'white', fontWeight: '600' }}
              >
                {statusText} {attendancePercentage}%
              </Chip>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalLearners}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#4CAF50' }]}>{attendanceCount}</Text>
                <Text style={styles.statLabel}>Present</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#E57373' }]}>{totalLearners - attendanceCount}</Text>
                <Text style={styles.statLabel}>Absent</Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={styles.statusValue}>
                  {session.isActive ? 'Active' : 'Completed'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No sessions found matching your search.</Text>
      <Button
        mode="outlined"
        onPress={() => setSearchQuery('')}
        style={styles.emptyStateButton}
      >
        Clear Search
      </Button>
    </View>
  );

  // Generate list of all students with attendance status for a specific session
  const generateAttendanceList = (session) => {
    // Start with all learners from the module
    return mockModuleData.learners.map(item => {
      const learner = item.learner;
      // Check if this learner is in the attendance list for this session
      const attended = session.attendences.some(a => a.studentId === learner.id);

      return {
        id: learner.id,
        name: learner.name,
        email: learner.email,
        status: attended ? 'present' : 'absent'
      };
    });
  };

  return (
    <Provider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={styles.modalContainer}
              dismissable={true}
            >
              {selectedSession && (
                <View>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {mockModuleData.name} - Session Details
                    </Text>
                    <Text style={styles.modalSubtitle}>
                      {formatDate(selectedSession.createdAt)}
                    </Text>
                    <Chip
                      style={[styles.moduleChip]}
                      textStyle={styles.moduleChipText}
                    >
                      {mockModuleData.level}
                    </Chip>
                  </View>

                  <View style={styles.attendanceSummary}>
                    <View style={styles.attendanceItem}>
                      <Text style={styles.attendanceValue}>{mockModuleData.learners.length}</Text>
                      <Text style={styles.attendanceLabel}>Total</Text>
                    </View>
                    <View style={styles.attendanceItem}>
                      <Text style={[styles.attendanceValue, { color: '#4CAF50' }]}>
                        {selectedSession.attendences.length}
                      </Text>
                      <Text style={styles.attendanceLabel}>Present</Text>
                    </View>
                    <View style={styles.attendanceItem}>
                      <Text style={[styles.attendanceValue, { color: '#E57373' }]}>
                        {mockModuleData.learners.length - selectedSession.attendences.length}
                      </Text>
                      <Text style={styles.attendanceLabel}>Absent</Text>
                    </View>
                  </View>

                  <Text style={styles.sectionHeader}>Attendance Details</Text>

                  <ScrollView style={styles.learnersList}>
                    {generateAttendanceList(selectedSession).map(learner => (
                      <List.Item
                        key={learner.id}
                        title={learner.name}
                        description={learner.email}
                        left={props => (
                          <List.Icon
                            {...props}
                            icon={learner.status === 'present' ? 'check-circle' : 'close-circle'}
                            color={learner.status === 'present' ? '#4CAF50' : '#E57373'}
                          />
                        )}
                        titleStyle={styles.learnerName}
                        descriptionStyle={styles.learnerEmail}
                        style={styles.learnerItem}
                      />
                    ))}
                  </ScrollView>

                  <View style={styles.buttonContainer}>
                    <Button
                      mode="contained"
                      onPress={hideModal}
                      style={styles.closeButton}
                      labelStyle={styles.buttonLabel}
                    >
                      Close
                    </Button>
                  </View>
                </View>
              )}
            </Modal>
          </Portal>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Session History</Text>
            <Avatar.Icon
              size={42}
              icon="account"
              style={styles.avatar}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.moduleInfoContainer}>
            <Text style={styles.moduleName}>{mockModuleData.name}</Text>
            <Chip style={styles.levelChip}>{mockModuleData.level}</Chip>
          </View>

          <Searchbar
            placeholder="Search by date"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor="#1976D2"
            placeholderTextColor="#90A4AE"
            loading={loading}
          />

          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : 'All Sessions'}
          </Text>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {filteredSessions.length > 0
              ? filteredSessions.map((session, index) => renderSessionCard(session, index))
              : renderEmptyState()
            }

            {/* Add a bit of space at the bottom for better scrolling */}
            <View style={styles.scrollPadding} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  avatar: {
    backgroundColor: '#1976D2',
  },
  moduleInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moduleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1565C0',
    flex: 1,
  },
  levelChip: {
    backgroundColor: '#E3F2FD',
    marginLeft: 8,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 12,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollPadding: {
    height: 20,
  },
  sessionCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
    backgroundColor: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  dateText: {
    fontSize: 13,
    color: '#546E7A',
    marginTop: 2,
  },
  statusChip: {
    height: 28,
    paddingHorizontal: 8,
  },
  divider: {
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  statLabel: {
    fontSize: 12,
    color: '#546E7A',
    marginTop: 2,
  },
  statusContainer: {
    marginLeft: 'auto',
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  // Modal styles
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '85%',
    elevation: 5,
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#546E7A',
    marginTop: 4,
    marginBottom: 8,
  },
  moduleChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    marginTop: 4,
  },
  moduleChipText: {
    color: '#1565C0',
  },
  attendanceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  attendanceItem: {
    alignItems: 'center',
  },
  attendanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  attendanceLabel: {
    fontSize: 13,
    color: '#546E7A',
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 12,
  },
  learnersList: {
    maxHeight: 240,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  learnerItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  learnerName: {
    fontSize: 15,
    color: '#333333',
  },
  learnerEmail: {
    fontSize: 12,
    color: '#757575',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  closeButton: {
    width: '100%',
    backgroundColor: '#1976D2',
    elevation: 2,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#78909C',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    borderColor: '#1976D2',
    borderWidth: 1,
  },
});
