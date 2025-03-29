import { View, Text, StyleSheet } from 'react-native';

const AdminProfile: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Profile</Text>
      <Text style={styles.paragraph}>Welcome to the admin profile page.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AdminProfile;
