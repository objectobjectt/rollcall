import { Tabs } from 'expo-router';
import {
  CircleUser as UserCircle2,
  QrCode,
  History,
  Settings,
  Scan,
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
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <UserCircle2 size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
