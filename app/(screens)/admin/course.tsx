import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define types for our data structures
type Badge = {
  id: string;
  name: string;
};

type Trainer = {
  id: string;
  name: string;
  expertise: Badge[];
};

type Learner = {
  id: string;
  name: string;
  badges: Badge[];
};

type Course = {
  id: string;
  title: string;
  description: string;
  trainers: Trainer[];
  learners: Learner[];
  requiredBadges: Badge[];
};

const AdminCoursePage: React.FC = () => {
  // Sample data (in a real app, this would come from an API)
  const [badges] = useState<Badge[]>([
    { id: '1', name: 'JavaScript' },
    { id: '2', name: 'React' },
    { id: '3', name: 'Node.js' },
    { id: '4', name: 'Python' },
    { id: '5', name: 'Data Science' },
  ]);

  const [trainers] = useState<Trainer[]>([
    { id: '1', name: 'John Doe', expertise: [badges[0], badges[1]] },
    { id: '2', name: 'Jane Smith', expertise: [badges[2], badges[3]] },
    { id: '3', name: 'Mike Johnson', expertise: [badges[1], badges[4]] },
  ]);

  const [learners] = useState<Learner[]>([
    { id: '1', name: 'Alice Brown', badges: [badges[0], badges[1]] },
    { id: '2', name: 'Bob Wilson', badges: [badges[2], badges[3]] },
    { id: '3', name: 'Carol White', badges: [badges[1], badges[4]] },
    { id: '4', name: 'Dave Green', badges: [badges[0], badges[3]] },
  ]);

  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Advanced React Development',
      description: 'Learn advanced React concepts and patterns',
      trainers: [trainers[0], trainers[2]],
      learners: [learners[0], learners[2]],
      requiredBadges: [badges[0], badges[1]],
    },
    {
      id: '2',
      title: 'Backend with Node.js',
      description: 'Build scalable backend applications with Node.js',
      trainers: [trainers[1]],
      learners: [learners[1]],
      requiredBadges: [badges[2]],
    },
  ]);

  // State for new course form
  const [newCourse, setNewCourse] = useState<{
    title: string;
    description: string;
    requiredBadges: Badge[];
  }>({
    title: '',
    description: '',
    requiredBadges: [],
  });

  // State for modals
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddTrainerModal, setShowAddTrainerModal] = useState(false);
  const [showAddLearnerModal, setShowAddLearnerModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Helper functions
  const addNewCourse = () => {
    if (newCourse.title.trim() === '') return;

    const course: Course = {
      id: (courses.length + 1).toString(),
      title: newCourse.title,
      description: newCourse.description,
      trainers: [],
      learners: [],
      requiredBadges: [...newCourse.requiredBadges],
    };

    setCourses([...courses, course]);
    setNewCourse({ title: '', description: '', requiredBadges: [] });
    setShowAddCourseModal(false);
  };

  const addTrainerToCourse = (trainer: Trainer, course: Course) => {
    // Only add if trainer has the required expertise
    const hasRequiredExpertise = course.requiredBadges.some((requiredBadge) =>
      trainer.expertise.some((expertise) => expertise.id === requiredBadge.id)
    );

    if (
      hasRequiredExpertise &&
      !course.trainers.some((t) => t.id === trainer.id)
    ) {
      const updatedCourses = courses.map((c) => {
        if (c.id === course.id) {
          return { ...c, trainers: [...c.trainers, trainer] };
        }
        return c;
      });
      setCourses(updatedCourses);
    }
  };

  const addLearnerToCourse = (learner: Learner, course: Course) => {
    // Check if learner already has required badges
    const hasRequiredBadges = course.requiredBadges.every((requiredBadge) =>
      learner.badges.some((badge) => badge.id === requiredBadge.id)
    );

    if (!course.learners.some((l) => l.id === learner.id)) {
      const updatedCourses = courses.map((c) => {
        if (c.id === course.id) {
          return { ...c, learners: [...c.learners, learner] };
        }
        return c;
      });
      setCourses(updatedCourses);
    }
  };

  const toggleBadgeSelection = (badge: Badge) => {
    const isSelected = newCourse.requiredBadges.some((b) => b.id === badge.id);

    if (isSelected) {
      setNewCourse({
        ...newCourse,
        requiredBadges: newCourse.requiredBadges.filter(
          (b) => b.id !== badge.id
        ),
      });
    } else {
      setNewCourse({
        ...newCourse,
        requiredBadges: [...newCourse.requiredBadges, badge],
      });
    }
  };

  // Render components
  const renderCourseItem = ({ item }: { item: Course }) => (
    <View style={styles.courseCard}>
      <Text style={styles.courseTitle}>{item.title}</Text>
      <Text style={styles.courseDescription}>{item.description}</Text>

      <Text style={styles.sectionTitle}>Required Badges:</Text>
      <View style={styles.badgeContainer}>
        {item.requiredBadges.map((badge) => (
          <View key={badge.id} style={styles.badge}>
            <Text style={styles.badgeText}>{badge.name}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Trainers ({item.trainers.length}):
      </Text>
      <View style={styles.listContainer}>
        {item.trainers.map((trainer) => (
          <Text key={trainer.id} style={styles.listItem}>
            {trainer.name}
          </Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Learners ({item.learners.length}):
      </Text>
      <View style={styles.listContainer}>
        {item.learners.map((learner) => (
          <Text key={learner.id} style={styles.listItem}>
            {learner.name}
          </Text>
        ))}
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setSelectedCourse(item);
            setShowAddTrainerModal(true);
          }}
        >
          <Text style={styles.actionButtonText}>Add Trainer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setSelectedCourse(item);
            setShowAddLearnerModal(true);
          }}
        >
          <Text style={styles.actionButtonText}>Add Learner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Course Management</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddCourseModal(true)}
          >
            <Text style={styles.addButtonText}>+ Add New Course</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>All Courses ({courses.length})</Text>

        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.courseList}
        />

        {/* Add Course Modal */}
        <Modal
          visible={showAddCourseModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Course</Text>

              <TextInput
                style={styles.input}
                placeholder="Course Title"
                value={newCourse.title}
                onChangeText={(text) =>
                  setNewCourse({ ...newCourse, title: text })
                }
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Course Description"
                multiline
                value={newCourse.description}
                onChangeText={(text) =>
                  setNewCourse({ ...newCourse, description: text })
                }
              />

              <Text style={styles.sectionTitle}>Select Required Badges:</Text>
              <ScrollView style={styles.badgeSelector}>
                {badges.map((badge) => {
                  const isSelected = newCourse.requiredBadges.some(
                    (b) => b.id === badge.id
                  );
                  return (
                    <TouchableOpacity
                      key={badge.id}
                      style={[
                        styles.badgeOption,
                        isSelected && styles.selectedBadge,
                      ]}
                      onPress={() => toggleBadgeSelection(badge)}
                    >
                      <Text
                        style={
                          isSelected
                            ? styles.selectedBadgeText
                            : styles.badgeOptionText
                        }
                      >
                        {badge.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowAddCourseModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={addNewCourse}
                >
                  <Text style={styles.confirmButtonText}>Create Course</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Add Trainer Modal */}
        <Modal
          visible={showAddTrainerModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Add Trainer to {selectedCourse?.title}
              </Text>

              <ScrollView style={styles.modalList}>
                {trainers
                  .filter(
                    (trainer) =>
                      !selectedCourse?.trainers.some(
                        (t) => t.id === trainer.id
                      ) &&
                      selectedCourse?.requiredBadges.some((requiredBadge) =>
                        trainer.expertise.some(
                          (expertise) => expertise.id === requiredBadge.id
                        )
                      )
                  )
                  .map((trainer) => (
                    <TouchableOpacity
                      key={trainer.id}
                      style={styles.modalListItem}
                      onPress={() => {
                        if (selectedCourse) {
                          addTrainerToCourse(trainer, selectedCourse);
                          setShowAddTrainerModal(false);
                        }
                      }}
                    >
                      <Text style={styles.modalItemName}>{trainer.name}</Text>
                      <View style={styles.badgeContainer}>
                        {trainer.expertise.map((badge) => (
                          <View key={badge.id} style={styles.badge}>
                            <Text style={styles.badgeText}>{badge.name}</Text>
                          </View>
                        ))}
                      </View>
                    </TouchableOpacity>
                  ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddTrainerModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Add Learner Modal */}
        <Modal
          visible={showAddLearnerModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Add Learner to {selectedCourse?.title}
              </Text>

              <ScrollView style={styles.modalList}>
                {learners
                  .filter(
                    (learner) =>
                      !selectedCourse?.learners.some((l) => l.id === learner.id)
                  )
                  .map((learner) => {
                    const hasRequiredBadges =
                      selectedCourse?.requiredBadges.every((requiredBadge) =>
                        learner.badges.some(
                          (badge) => badge.id === requiredBadge.id
                        )
                      );

                    return (
                      <TouchableOpacity
                        key={learner.id}
                        style={[
                          styles.modalListItem,
                          !hasRequiredBadges && styles.disabledItem,
                        ]}
                        onPress={() => {
                          if (selectedCourse) {
                            addLearnerToCourse(learner, selectedCourse);
                            setShowAddLearnerModal(false);
                          }
                        }}
                        disabled={!hasRequiredBadges}
                      >
                        <Text style={styles.modalItemName}>{learner.name}</Text>
                        <View style={styles.badgeContainer}>
                          {learner.badges.map((badge) => (
                            <View key={badge.id} style={styles.badge}>
                              <Text style={styles.badgeText}>{badge.name}</Text>
                            </View>
                          ))}
                        </View>
                        {!hasRequiredBadges && (
                          <Text style={styles.warningText}>
                            Missing required badges
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddLearnerModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  courseList: {
    paddingBottom: 20,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: '#555',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#E1F5FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#0288D1',
  },
  listContainer: {
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  badgeSelector: {
    maxHeight: 120,
    marginBottom: 16,
  },
  badgeOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  badgeOptionText: {
    color: '#555',
  },
  selectedBadge: {
    backgroundColor: '#2196F3',
  },
  selectedBadgeText: {
    color: 'white',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#555',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  modalListItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  disabledItem: {
    opacity: 0.5,
  },
  modalItemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  warningText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#555',
    fontWeight: '500',
  },
});

export default AdminCoursePage;
