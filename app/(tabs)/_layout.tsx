import { Tabs } from 'expo-router';
import {
  CircleUser as UserCircle2,
  QrCode,
  History,
  Settings,
} from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: isTeacher ? 'Dashboard' : 'Scan',
          tabBarIcon: ({ color, size }) =>
            isTeacher ? (
              <UserCircle2 size={size} color={color} />
            ) : (
              <QrCode size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
