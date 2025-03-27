import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, List, Switch, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import { useState } from 'react';

export default function ProfileScreen() {
//   const dispatch = useDispatch();
  const user = {
    name: 'John Doe',
    email: 'test@gmail.com',
    role: 'student',
  }
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleLogout = () => {
    // dispatch(logout());
    // router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400' }}
          style={styles.avatar}
        />
        <Text variant="headlineSmall" style={styles.name}>{user?.name}</Text>
        <Text variant="bodyLarge" style={styles.email}>{user?.email}</Text>
        <Text variant="bodyMedium" style={styles.role}>
          {user?.role === 'teacher' ? 'Teacher' : 'Student'}
        </Text>
      </View>

      <View style={styles.content}>
        <List.Section>
          <List.Subheader>Settings</List.Subheader>
          
          <List.Item
            title="Notifications"
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Location Services"
            right={() => (
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Change Password"
            onPress={() => {}}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          
          <List.Item
            title="Privacy Policy"
            onPress={() => {}}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          
          <List.Item
            title="Terms of Service"
            onPress={() => {}}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor="#f44336"
        >
          Logout
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
  },
  email: {
    color: '#666',
    marginTop: 4,
  },
  role: {
    color: '#666',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoutButton: {
    margin: 20,
  },
});