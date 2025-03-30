import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Api } from '@/constants/ApiConstants';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';

const HomeTrainer = () => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse]: any = useState(null);
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [courses, setCourses] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

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
      console.log("Courses: ", newCourses);
      const totalSessions = courses.reduce((sum, course) => sum + course.sessions.length, 0);
      setTotalSessions(totalSessions);

      setCourses(newCourses);
      const total = newCourses.reduce((sum, course) => sum + course.students, 0);
      setTotalStudents(total);
    }

    fetchCourses();
  }, []);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setCourseModalVisible(true);
    setSessionStarted(false);
  };

  const startSession = () => {
    console.log("Session started for course:", selectedCourse);
    if (selectedCourse && selectedCourse.id) {
      Api.post(Api.TRAINER_CREATE_SESSION, {
        courseId: selectedCourse.id,
      });
      router.push('/(screens)/trainer/generateQR')
    }
    setSessionStarted(true);
    // TODO: api req to start session
    fetchLearners();
  };

  const fetchLearners = () => {
    setLoading(true);

    // Simulate API call to get learners who are marked present
    setTimeout(() => {
      console.log("Request sent: Fetching learners for course", selectedCourse.id);

      // Simulate backend response by randomly marking some learners as present
      // const updatedLearners = dummyLearners[selectedCourse.id].map(learner => ({
      //   ...learner,
      //   isPresent: Math.random() > 0.3 // Randomly mark ~70% as present
      // }));

      // setLearners(updatedLearners);
      setLoading(false);

      // Set up polling for real-time updates
      startPolling();
    }, 1000);
  };

  const startPolling = () => {
    // Poll for updates every 3 seconds
    const pollingInterval = setInterval(() => {
      if (!sessionStarted) {
        clearInterval(pollingInterval);
        return;
      }

      setRefreshing(true);
      console.log("Request sent: Polling for attendance updates");

      // Simulate backend response with updated attendance
      setTimeout(() => {
        const updatedLearners = [...learners];

        // Randomly update 1-2 learners' attendance status
        const numUpdates = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numUpdates; i++) {
          const randomIndex = Math.floor(Math.random() * updatedLearners.length);
          // Either toggle or set to present (biased towards present)
          if (Math.random() > 0.3 || !updatedLearners[randomIndex].isPresent) {
            updatedLearners[randomIndex] = {
              ...updatedLearners[randomIndex],
              isPresent: !updatedLearners[randomIndex].isPresent
            };
          }
        }

        setLearners(updatedLearners);
        setRefreshing(false);
      }, 500);
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(pollingInterval);
  };

  const closeModal = () => {
    setCourseModalVisible(false);
    setSessionStarted(false);
  };

  const renderCourseCard = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => handleSelectCourse(item)}
    >
      <View style={styles.courseHeader}>
        <Text style={styles.courseTitle}>{item.name}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{item.level}</Text>
        </View>
      </View>

      <View style={styles.courseDetails}>
        <View style={styles.courseDetail}>
          <Ionicons name="people" size={18} color="#1E90FF" />
          <Text style={styles.detailText}>{item.students} Learners</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleSelectCourse(item)}
        >
          <Text style={styles.viewButtonText}>View Course</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderLearnerItem = ({ item }) => (
    <View style={styles.learnerItem}>
      <View style={styles.learnerInfo}>
        <Text style={styles.learnerAvatar}>{item.avatar}</Text>
        <Text style={styles.learnerName}>{item.name}</Text>
      </View>
      <View style={[
        styles.statusIndicator,
        item.isPresent ? styles.presentIndicator : styles.absentIndicator
      ]}>
        <Text style={styles.statusText}>{item.isPresent ? 'Present' : 'Absent'}</Text>
      </View>
    </View>
  );

  const getPresentCount = () => {
    return learners.filter(learner => learner.isPresent).length;
  };

  const getAttendancePercentage = () => {
    if (learners.length === 0) return 0;
    return Math.round((getPresentCount() / learners.length) * 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0052CC" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{user?.name}</Text>
        <Text style={styles.headerSubtitle}>Your Dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{courses.length}</Text>
          <Text style={styles.statLabel}>Active Courses</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalStudents}</Text>
          <Text style={styles.statLabel}>Total Learners</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalSessions}</Text>
          <Text style={styles.statLabel}>Total Sessions </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Assigned Courses</Text>
      </View>

      <FlatList
        data={courses}
        renderItem={renderCourseCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.coursesList}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={courseModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedCourse?.name}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close" size={24} color="#0052CC" />
              </TouchableOpacity>
            </View>

            {!sessionStarted ? (
              <View style={styles.courseDetailContainer}>
                <View style={styles.courseDetailItem}>
                  <Text style={styles.detailLabel}>Level:</Text>
                  <Text style={styles.detailValue}>{selectedCourse?.level}</Text>
                </View>
                <View style={styles.courseDetailItem}>
                  <Text style={styles.detailLabel}>Students:</Text>
                  <Text style={styles.detailValue}>{selectedCourse?.students} Learners</Text>
                </View>

                <TouchableOpacity
                  style={styles.startSessionButton}
                  onPress={startSession}
                >
                  <Ionicons name="play-circle" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.startSessionButtonText}>Start Session</Text>
                </TouchableOpacity>

                <Text style={styles.instructionText}>
                  Start a session to view real-time attendance from the backend.
                </Text>
              </View>
            ) : (
              <View style={styles.sessionContainer}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionTitle}>Live Session</Text>
                    <Text style={styles.sessionSubtitle}>{new Date().toLocaleTimeString()}</Text>
                  </View>

                  <View style={styles.attendanceSummary}>
                    <View style={styles.attendanceCount}>
                      <Text style={styles.attendanceNumber}>{getPresentCount()}/{learners.length}</Text>
                      <Text style={styles.attendanceLabel}>Present</Text>
                    </View>
                    <View style={styles.attendancePercentage}>
                      <Text style={styles.percentageNumber}>{getAttendancePercentage()}%</Text>
                      <Text style={styles.percentageLabel}>Attendance</Text>
                    </View>
                  </View>
                </View>

                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0052CC" />
                    <Text style={styles.loadingText}>Loading learners...</Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.learnersHeader}>
                      <Text style={styles.learnersTitle}>Learners</Text>
                      {refreshing && (
                        <View style={styles.refreshIndicator}>
                          <ActivityIndicator size="small" color="#0052CC" />
                          <Text style={styles.refreshText}>Updating...</Text>
                        </View>
                      )}
                    </View>

                    <FlatList
                      data={learners}
                      renderItem={renderLearnerItem}
                      keyExtractor={item => item.id}
                      style={styles.learnersList}
                    />
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeTrainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  header: {
    backgroundColor: '#0052CC',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#B3D1FF',
    marginTop: 4,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: -20,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '30%',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0052CC',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  coursesList: {
    padding: 10,
    paddingBottom: 20,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  levelBadge: {
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    color: '#0052CC',
    fontWeight: '500',
  },
  courseDetails: {
    marginBottom: 12,
  },
  courseDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewButton: {
    backgroundColor: '#0052CC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  courseDetailContainer: {
    padding: 20,
  },
  courseDetailItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    width: 100,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  startSessionButton: {
    backgroundColor: '#0052CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonIcon: {
    marginRight: 8,
  },
  startSessionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
    fontSize: 14,
  },
  sessionContainer: {
    flex: 1,
  },
  sessionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#F5F9FF',
  },
  sessionInfo: {
    marginBottom: 12,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0052CC',
  },
  sessionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  attendanceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attendanceCount: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  attendanceNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0052CC',
  },
  attendanceLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  attendancePercentage: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  percentageNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0052CC',
  },
  percentageLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  learnersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  learnersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 12,
    color: '#0052CC',
    marginLeft: 6,
  },
  learnersList: {
    paddingHorizontal: 16,
  },
  learnerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  learnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnerAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  learnerName: {
    fontSize: 16,
    color: '#333',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  presentIndicator: {
    backgroundColor: '#E6F7EE',
  },
  absentIndicator: {
    backgroundColor: '#FEEAE6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  }
});
